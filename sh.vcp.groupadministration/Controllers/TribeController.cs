using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sh.vcp.groupadministration.dal.Managers;
using sh.vcp.groupadministration.dal.Model;
using sh.vcp.groupadministration.Extensions;
using sh.vcp.identity.Model;
using sh.vcp.identity.Model.Tribe;
using Server.Filters;
using Swashbuckle.AspNetCore.Annotations;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/tribe")]
    public class TribeController : Controller
    {
        private readonly IMemberManager _memberManager;
        private readonly ITribeManager _manager;
        private readonly ILogger<TribeController> _logger;
        private readonly IHostingEnvironment _env;

        public TribeController(IMemberManager memberManager, ITribeManager manager, ILogger<TribeController> logger,
            IHostingEnvironment env)
        {
            this._memberManager = memberManager;
            this._manager = manager;
            this._logger = logger;
            this._env = env;
        }

        [HttpGet]
        [SwaggerResponse(200, "", typeof(ICollection<Tribe>))]
        public async Task<IActionResult> List()
        {
            try
            {
                ICollection<Tribe> tribes = await this._manager.List();
                ICollection<string> userDivisions = this.GetUserDivisions();
                return this.Ok(tribes.Where(tribe => userDivisions.Contains(tribe.DivisionId)));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(TribeController) + nameof(this.List));
                return this.Error(this._env, ex);
            }
        }

        [HttpGet("{id}")]
        [SwaggerResponse(200, "", typeof(Tribe))]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                return this.Ok(await this._manager.Get(id));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(TribeController) + nameof(this.Get));
                return this.Error(this._env, ex);
            }
        }

        /// <summary>
        /// Get all members that are sl, gs, gv or lr
        /// </summary>
        /// <param name="tribeId"></param>
        /// <returns></returns>
        [HttpGet("{tribeId}/specialmembers")]
        [SwaggerResponse(200, "", typeof(List<WireMember>))]
        public async Task<IActionResult> GetSpecialMembers(int tribeId)
        {
            try
            {
                var tribe = await this._manager.Get(tribeId);
                if (tribe == null)
                {
                    return this.NotFound();
                }

                ICollection<LdapMember> list = await this._memberManager.ListTribeSpecialMembers(tribe);
                return this.Ok(list.Select(m => new WireMember(m, WireMember.UserType.MinimalUser)));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(TribeController) + nameof(this.GetSpecialMembers));
                return this.Error(this._env, ex);
            }
        }

        /// <summary>
        /// Get all members (only for admin)
        /// </summary>
        /// <param name="tribeId"></param>
        /// <returns></returns>
        [HttpGet("{tribeId}/members")]
        [SwaggerResponse(200, "", typeof(List<WireMember>))]
        public async Task<IActionResult> GetMembers(int tribeId)
        {
            try
            {
                var tribe = await this._manager.Get(tribeId);
                if (tribe == null)
                {
                    return this.NotFound();
                }

                if (!this.CanEditTribe(tribe))
                {
                    return this.Unauthorized();
                }

                ICollection<LdapMember> list = await this._memberManager.ListTribeMembers(tribe);
                return this.Ok(list.Select(m => new WireMember(m, WireMember.UserType.MinimalUser)));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(TribeController) + nameof(this.GetSpecialMembers));
                return this.Error(this._env, ex);
            }
        }

        [HttpPost]
        [ValidateModelState]
        public async Task<IActionResult> Create([FromBody] Tribe tribe, CancellationToken cancellationToken)
        {
            try
            {
                if (!this.GetUserLgsDivisions().Contains(tribe.DivisionId))
                {
                    return this.Unauthorized();
                }

                var newTribe = await this._manager.Create(tribe, nameof(TribeController) + nameof(this.Create), cancellationToken);
                return this.Ok(newTribe);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(TribeController) + nameof(this.Create));
                return this.Error(this._env, ex);
            }
        }
    }
}