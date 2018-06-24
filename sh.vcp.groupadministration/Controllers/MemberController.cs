using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using sh.vcp.groupadministration.dal.Managers;
using sh.vcp.groupadministration.Extensions;
using sh.vcp.identity.Model;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Server.Controllers
{
    [Route("api/member")]
    public class MemberController: Controller
    {
        private readonly IMemberManager _manager;
        private readonly ITribeManager _tribe;
        private readonly IGroupManager _group;
        private readonly ILogger<MemberController> _logger;
        private readonly IHostingEnvironment _env;

        public MemberController(IMemberManager manager, ITribeManager tribe, IGroupManager group, ILogger<MemberController> logger, IHostingEnvironment env)
        {
            this._manager = manager;
            this._group = group;
            this._logger = logger;
            this._env = env;
            this._tribe = tribe;
        }

        [HttpGet]
        [SwaggerResponse(200, typeof(List<LdapMember>))]
        // TODO: Swagger response type not correct for idsOnly == true
        // [SwaggerResponse(200, typeof(List<string>))]
        public async Task<IActionResult> GetMembers(bool idsOnly = true)
        {
            try
            {
                // TODO: null checks
                return idsOnly ? this.Ok(await this._manager.ListIds()) : this.Ok(await this._manager.List());
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(MemberController) + nameof(this.GetMembers));
                return this.Error(this._env, ex);
            }
        }

        [HttpGet("{id}")]
        [SwaggerResponse(200, typeof(LdapMember))]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                // TODO: null checks
                return this.Ok(await this._manager.Get(id));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(MemberController) + nameof(this.Get));
                return this.Error(this._env, ex);
            }
        }

        [HttpPost]
        [SwaggerResponse(200, typeof(LdapMember))]
        public async Task<IActionResult> Create([FromBody] LdapMember member)
        {
            try
            {
                // TODO: null checks
                var m = await this._manager.Create(member);
                var t = await this._tribe.Get(m.TribeId);
                t.MemberIds.Add(m.Id);
                await this._group.SetMembers(t.Dn, t.MemberIds.ToArray());
                
                return this.Ok(m);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(MemberController) + nameof(this.Create));
                return this.Error(this._env, ex);
            }
        }
        
    }
}