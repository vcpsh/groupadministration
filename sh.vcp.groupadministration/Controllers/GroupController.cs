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
using sh.vcp.identity.Models;
using Swashbuckle.AspNetCore.Annotations;

namespace Server.Controllers
{
    [Route("api/group")]
    [Authorize]
    public class GroupController : Controller
    {
        private readonly IGroupManager _manager;
        private readonly ITribeManager _tribeManager;
        private readonly IMemberManager _memberManager;
        private readonly IHostingEnvironment _env;
        private readonly IVotedGroupManager _votedGroupManager;
        private readonly ILogger<GroupController> _logger;

        public GroupController(IGroupManager manager, ITribeManager tribeManager, IMemberManager memberManager,
            IHostingEnvironment env, ILogger<GroupController> logger, IVotedGroupManager votedGroupManager)
        {
            this._manager = manager;
            this._tribeManager = tribeManager;
            this._memberManager = memberManager;
            this._env = env;
            this._logger = logger;
            this._votedGroupManager = votedGroupManager;
        }

        [HttpGet("{dn}/members")]
        [SwaggerResponse(200, "List of group members", typeof(List<WireMember>))]
        public async Task<IActionResult> GetMembers(string dn, CancellationToken cancellationToken)
        {
            try
            {
                var group = await this._manager.Get(dn, cancellationToken);
                List<WireMember> list = new List<WireMember>();
                switch (group.Type)
                {
                    case LdapGroup.GroupType.Group:
                    case LdapGroup.GroupType.Division:
                        break;
                    case LdapGroup.GroupType.VotedGroup:
                    {
                        var votedGroup = await this._votedGroupManager.Get(dn, cancellationToken);
                        IEnumerable<string> activeMemberIds = votedGroup.ActiveVoteEntries.Select(m => m.MemberUid);
                        list = (await this._memberManager.ListVotedGroupMembers(votedGroup, cancellationToken))
                            .Select(m => new WireMember(m,
                                activeMemberIds.Contains(m.Id)
                                    ? WireMember.UserType.ContactUser
                                    : WireMember.UserType.MinimalUser))
                            .ToList();
                        break;
                    }
                    case LdapGroup.GroupType.Tribe:
                    case LdapGroup.GroupType.TribeGs:
                    case LdapGroup.GroupType.TribeSl:
                    case LdapGroup.GroupType.TribeLr:
                    case LdapGroup.GroupType.TribeLv:
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                return this.Ok(list);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(GroupController) + nameof(this.GetMembers));
                return this.Error(this._env, ex);
            }
        }

        [HttpGet("{dn}/possiblemembers")]
        [SwaggerResponse(200, "", typeof(List<WireMember>))]
        public async Task<IActionResult> GetPossibleMembers(string dn, CancellationToken cancellationToken)
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
                        // TODO: Show only members with active account for group add
                        break;
                    case LdapGroup.GroupType.Division:
                        break;
                    case LdapGroup.GroupType.VotedGroup:
                        ICollection<LdapMember> divisionMembers =
                            await this._memberManager.ListDivisionMembers(group.DivisionId, cancellationToken);
                        return this.Ok(divisionMembers.Select(m => new WireMember(m, WireMember.UserType.MinimalUser))
                            .OrderBy(m => m.UserName ?? m.FirstName));
                    case LdapGroup.GroupType.Tribe:
                        return this.BadRequest();
                    case LdapGroup.GroupType.TribeGs:
                    case LdapGroup.GroupType.TribeSl:
                    case LdapGroup.GroupType.TribeLr:
                    case LdapGroup.GroupType.TribeLv:
                    {
                        var tribe = await this._tribeManager.GetByDn(dn.Replace($"cn={group.Id},", ""),
                            cancellationToken);
                        if (!this.CanEditTribe(tribe))
                        {
                            return this.Unauthorized();
                        }

                        ICollection<LdapMember> tribeMembers =
                            await this._memberManager.ListTribeMembers(tribe, cancellationToken);
                        return this.Ok(tribeMembers.Select(m => new WireMember(m, WireMember.UserType.MinimalUser))
                            .OrderBy(m => m.UserName ?? m.FirstName));
                    }
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
        public async Task<IActionResult> SetMembers(string dn, [FromBody] string[] members,
            CancellationToken cancellationToken)
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
                    case LdapGroup.GroupType.VotedGroup:
                    {
//                        var group = await this._
                        break;
                    }
                    case LdapGroup.GroupType.Group:
                    case LdapGroup.GroupType.Division:
                    case LdapGroup.GroupType.Tribe:
                        return this.BadRequest();
                    case LdapGroup.GroupType.TribeGs:
                    case LdapGroup.GroupType.TribeSl:
                    case LdapGroup.GroupType.TribeLr:
                    case LdapGroup.GroupType.TribeLv:
                        var tribe = await this._tribeManager.GetByDn(dn.Replace($"cn={group.Id},", ""),
                            cancellationToken);
                        if (!this.CanEditTribe(tribe))
                        {
                            return this.Unauthorized();
                        }

                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                group.MemberIds = members.Distinct().ToList();
                await this._manager.SetMembers(group, cancellationToken);
                return this.Ok();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(GroupController) + nameof(this.SetMembers));
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