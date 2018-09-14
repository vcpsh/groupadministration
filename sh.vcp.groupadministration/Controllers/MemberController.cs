using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sh.vcp.groupadministration.dal.Managers;
using sh.vcp.groupadministration.Extensions;
using sh.vcp.identity.Model;
using Swashbuckle.AspNetCore.Annotations;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/member")]
    public class MemberController : Controller
    {
        private readonly IDivisionManager _division;
        private readonly IMemberManager _manager;
        private readonly ITribeManager _tribe;
        private readonly IGroupManager _group;
        private readonly ILogger<MemberController> _logger;
        private readonly IHostingEnvironment _env;

        public MemberController(IDivisionManager division, IMemberManager manager, ITribeManager tribe,
            IGroupManager group, ILogger<MemberController> logger, IHostingEnvironment env)
        {
            this._division = division;
            this._manager = manager;
            this._group = group;
            this._logger = logger;
            this._env = env;
            this._tribe = tribe;
        }

        [HttpGet("division/{id}")]
        [SwaggerResponse(200, "", typeof(List<LdapMember>))]
        public async Task<IActionResult> GetDivisionMembers(string id)
        {
            try
            {
                if (!this.GetUserLgsDivisions().Contains(id))
                {
                    return this.Unauthorized();
                }

                return this.Ok(await this._manager.ListDivisionMembers(id));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(MemberController) + nameof(this.GetDivisionMembers));
                return this.Error(this._env, ex);
            }
        }

        [HttpGet("{id}")]
        [SwaggerResponse(200, "", typeof(LdapMember))]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                var member = await this._manager.Get(id);
                if (member == null)
                {
                    return this.NotFound();
                }

                return this.Ok(member);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(MemberController) + nameof(this.Get));
                return this.Error(this._env, ex);
            }
        }

        [HttpPost("create/{tribeId}")]
        [SwaggerResponse(200, "", typeof(LdapMember))]
        public async Task<IActionResult> Create(int tribeId, [FromBody] LdapMember member)
        {
            try
            {
                // TODO: null checks
                var t = await this._tribe.Get(tribeId);
                if (t == null)
                {
                    return this.BadRequest($"The tribe {tribeId} does not exist.");
                }

                var division = await this._division.Get(t.DivisionId);
                var m = await this._manager.Create(member);
                division.MemberIds.Add(m.Id);
                t.MemberIds.Add(m.Id);
                await this._group.SetMembers(division);
                await this._group.SetMembers(t);

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