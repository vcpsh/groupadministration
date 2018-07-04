using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sh.vcp.groupadministration.dal.Managers;
using sh.vcp.groupadministration.Extensions;

namespace Server.Controllers
{
    [Route("api/group")]
    public class GroupController: Controller
    {
        private readonly IGroupManager _manager;
        private readonly IHostingEnvironment _env;
        private readonly ILogger<GroupController> _logger;

        public GroupController(IGroupManager manager, IHostingEnvironment env, ILogger<GroupController> logger)
        {
            this._manager = manager;
            this._env = env;
            this._logger = logger;
        }
        
        [HttpPost("{dn}/memberIds")]
        public async Task<IActionResult> SetMemberIds(string dn, [FromBody] string[] nextMembers)
        {
                throw new System.NotImplementedException();
            try
            {
//                return this.Ok(await this._manager.SetMembers(dn, nextMembers));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(GroupController) + nameof(this.SetMemberIds));
                return this.Error(this._env, ex);
            }  
        }

        [HttpGet("{dn}/members")]
        public async Task<IActionResult> GetMembers(string dn)
        {
            try
            {
                return this.Ok(await this._manager.GetMembers(dn));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(GroupController) + nameof(this.GetMembers));
                return this.Error(this._env, ex);
            }
        }

        [HttpGet("{dn}")]
        public async Task<IActionResult> Get(string dn)
        {
            try
            {
                return this.Ok(await this._manager.Get(dn));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(GroupController) + nameof(this.Get));
                return this.Error(this._env, ex);
            }
        }
    }
}