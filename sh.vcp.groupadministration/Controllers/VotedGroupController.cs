using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sh.vcp.groupadministration.dal.Managers;
using sh.vcp.groupadministration.Extensions;
using sh.vcp.identity.Model;
using sh.vcp.identity.Models;
using Server.Filters;
using Swashbuckle.AspNetCore.Annotations;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/votedgroup")]
    public class VotedGroupController : Controller
    {
        private readonly IVotedGroupManager _manager;
        private readonly IHostingEnvironment _env;
        private readonly ILogger<VotedGroupController> _logger;

        public VotedGroupController(IVotedGroupManager manager, IHostingEnvironment env,
            ILogger<VotedGroupController> logger)
        {
            this._manager = manager;
            this._env = env;
            this._logger = logger;
        }

        [HttpGet]
        [SwaggerResponse(200, "", typeof(ICollection<VotedLdapGroup>))]
        public async Task<IActionResult> List()
        {
            try
            {
                ICollection<VotedLdapGroup> groups = await this._manager.List();
                ICollection<string> userDivisions = this.GetUserDivisions();
                return this.Ok(groups.Where(group => userDivisions.Contains(group.DivisionId)));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(VotedGroupController) + nameof(this.List));
                return this.Error(this._env, ex);
            }
        }
        
        [HttpPost]
        [ValidateModelState]
        [SwaggerResponse(200, "The created group", typeof(VotedLdapGroup))]
        public async Task<IActionResult> Create([FromBody] VotedLdapGroup group, CancellationToken cancellationToken)
        {
            try
            {
                if (!this.GetUserLgsDivisions().Contains(group.DivisionId))
                {
                    return this.Unauthorized();
                }
                var newGroup = await this._manager.Create(group, nameof(VotedGroupController) + nameof(this.Create), cancellationToken);
                return this.Ok(newGroup);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(VotedGroupController) + nameof(this.Create));
                return this.Error(this._env, ex);
            }
        }

        [HttpPost("{dn}/addMembers")]
        [ValidateModelState]
        [SwaggerResponse(200, "The updated group", typeof(VotedLdapGroup))]
        public async Task<IActionResult> AddMembers(string dn, [FromBody] AddMembersModel newMembers, CancellationToken cancellationToken)
        {
            try
            {
                var group = await this._manager.Get(dn, cancellationToken);
                if (group == null)
                {
                    return this.NotFound();
                }

                group = await this._manager.AddMembers(group, newMembers.StartEvent, newMembers.EndEvent, newMembers.StartDate, newMembers.NewMembers, nameof(VotedGroupController) + nameof(this.AddMembers), cancellationToken);
                return this.Ok(group);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(VotedGroupController) + nameof(this.AddMembers));
                return this.Error(this._env, ex);
            }
        }
        
        [HttpPost("{dn}/removeMembers")]
        [ValidateModelState]
        [SwaggerResponse(200, "The updated group", typeof(VotedLdapGroup))]
        public async Task<IActionResult> RemoveMembers(string dn, [FromBody] RemoveMembersModel removedMembers, CancellationToken cancellationToken)
        {
            try
            {
                var group = await this._manager.Get(dn, cancellationToken);
                if (group == null)
                {
                    return this.NotFound();
                }

                group = await this._manager.RemoveMembers(group, removedMembers.EndEvent, removedMembers.EndDate, removedMembers.RemovedMembers, nameof(VotedGroupController) + nameof(this.RemoveMembers), cancellationToken);
                return this.Ok(group);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(VotedGroupController) + nameof(this.RemoveMembers));
                return this.Error(this._env, ex);
            }
        }

        public class AddMembersModel
        {
            [Required]
            public string StartEvent { get; set; }
            [Required]
            public string EndEvent { get; set; }
            [Required]
            public DateTime StartDate { get; set; }
            [Required]
            [MinLength(1)]
            public List<string> NewMembers { get; set; }
        }
        
        public class RemoveMembersModel
        {
            [Required]
            public string EndEvent { get; set; }
            [Required]
            public DateTime EndDate { get; set; }
            [Required]
            [MinLength(1)]
            public List<VoteEntry> RemovedMembers { get; set; }
        }
    }
}