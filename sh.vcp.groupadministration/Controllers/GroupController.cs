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
using sh.vcp.identity.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Server.Controllers
{
    [Route("api/group")]
    [Authorize]
    public class GroupController: Controller
    {
        private readonly IGroupManager _manager;
        private readonly ITribeManager _tribeManager;
        private readonly IMemberManager _memberManager;
        private readonly IHostingEnvironment _env;
        private readonly ILogger<GroupController> _logger;

        public GroupController(IGroupManager manager, ITribeManager tribeManager, IMemberManager memberManager, IHostingEnvironment env, ILogger<GroupController> logger)
        {
            this._manager = manager;
            this._tribeManager = tribeManager;
            this._memberManager = memberManager;
            this._env = env;
            this._logger = logger;
        }

        [HttpGet("{dn}/possiblemembers")]
        [SwaggerResponse(200, typeof(List<WireMember>))]
        public async Task<IActionResult> GetPossibleMembers(string dn, CancellationToken cancellationToken)
        {
            try
            {
                var group = await this._manager.Get(dn, cancellationToken);
                if (group == null)
                {
                    return this.NotFound();
                }
                switch (group.Type) {
                    case LdapGroup.GroupType.Group:
                        break;
                    case LdapGroup.GroupType.Division:
                        break;
                    case LdapGroup.GroupType.VotedGroup:
                        break;
                    case LdapGroup.GroupType.Tribe:
                        return this.BadRequest();
                    case LdapGroup.GroupType.TribeGs:
                    case LdapGroup.GroupType.TribeSl:
                    case LdapGroup.GroupType.TribeLr:
                    case LdapGroup.GroupType.TribeLv:
                        var tribe = await this._tribeManager.GetByDn(dn.Replace($"cn={group.Id},", ""), cancellationToken);
                        if (!this.CanEditTribe(tribe))
                        {
                            return this.Unauthorized();
                        }
                        return this.Ok(await this._memberManager.ListTribeMembers(tribe, cancellationToken));
                        
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                return this.Ok(new List<WireMember>());
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(GroupController) + nameof(this.GetPossibleMembers));
                return this.Error(this._env, ex);
            }
        }
        
        [HttpPost("{dn}/members")]
        public async Task<IActionResult> SetMembers(string dn, [FromBody] string[] members, CancellationToken cancellationToken)
        {
            try
            {
                var group = await this._manager.Get(dn, cancellationToken);
                if (group == null)
                {
                    return this.NotFound();
                }

                switch (group.Type)
                {
                    case LdapGroup.GroupType.Group:
                    case LdapGroup.GroupType.Division:
                    case LdapGroup.GroupType.VotedGroup:
                    case LdapGroup.GroupType.Tribe:
                        return this.BadRequest();
                    case LdapGroup.GroupType.TribeGs:
                    case LdapGroup.GroupType.TribeSl:
                    case LdapGroup.GroupType.TribeLr:
                    case LdapGroup.GroupType.TribeLv:
                        var tribe = await this._tribeManager.GetByDn(dn.Replace($"cn={group.Id},", ""), cancellationToken);
                        if (!this.CanEditTribe(tribe))
                        {
                            return this.Unauthorized();
                        }
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                group.MemberIds = group.MemberIds.Concat(members).ToList();
                await this._manager.SetMembers(group, cancellationToken);
                return this.Ok();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(GroupController) + nameof(this.SetMembers));
                return this.Error(this._env, ex);
            }  
        }

//        [HttpGet("{dn}/members")]
//        public async Task<IActionResult> GetMembers(string dn)
//        {
//            try
//            {
//                return this.Ok(await this._manager.GetMembers(dn));
//            }
//            catch (Exception ex)
//            {
//                this._logger.LogError(ex, nameof(GroupController) + nameof(this.GetMembers));
//                return this.Error(this._env, ex);
//            }
//        }

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