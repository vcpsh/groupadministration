using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sh.vcp.groupadministration.dal.Managers;
using sh.vcp.groupadministration.Extensions;
using sh.vcp.identity.Models;
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
    }
}