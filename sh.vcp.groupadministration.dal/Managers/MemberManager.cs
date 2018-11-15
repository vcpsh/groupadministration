using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Novell.Directory.Ldap;
using sh.vcp.groupadministration.dal.Extensions;
using sh.vcp.identity.Model;
using sh.vcp.identity.Model.Tribe;
using sh.vcp.identity.Models;
using sh.vcp.ldap;
using ILdapConnection = sh.vcp.ldap.ILdapConnection;

namespace sh.vcp.groupadministration.dal.Managers
{
    internal class MemberManager :IMemberManager
    {
        private readonly LdapConfig _config;
        private readonly ILdapConnection _connection;
        private readonly IDivisionManager _divisionManager;

        public MemberManager(ILdapConnection connection, LdapConfig config, IDivisionManager divisionManager)
        {
            this._connection = connection;
            this._config = config;
            this._divisionManager = divisionManager;
        }

        public async Task<ICollection<LdapMember>> ListDivisionMembers(string divisionId,
            CancellationToken cancellationToken = default)
        {
            var division = await this._divisionManager.Get(divisionId, cancellationToken);
            if (division == null) return new List<LdapMember>();
            // TODO: I'm pretty sure it is faster to load all members and filter them with LINQ in comparision to individual searches for each member id.
            ICollection<LdapMember> allMembers = await this._connection.Search<LdapMember>(this._config.MemberDn, null,
                LdapObjectTypes.Member, LdapConnection.SCOPE_ONE, LdapMember.LoadProperties, cancellationToken);

            return allMembers.Where(m => division.MemberIds.Contains(m.Id)).ToList();
        }

        public Task<ICollection<LdapMember>> ListTribeSpecialMembers(Tribe tribe,
            CancellationToken cancellationToken = default)
        {
            List<string> memberIds = new List<string>();
            memberIds.AddRange(tribe.Sl.MemberIds);
            memberIds.AddRange(tribe.Gs.MemberIds);
            memberIds.AddRange(tribe.Lv.MemberIds);
            memberIds.AddRange(tribe.Lr.MemberIds);

            return memberIds.Distinct().SelectAsync(m => this.Get(m, cancellationToken));
        }

        public Task<LdapMember> Get(string id, CancellationToken cancellationToken = default)
        {
            return this._connection.Read<LdapMember>($"cn={id},{this._config.MemberDn}", cancellationToken);
        }

        public async Task<LdapMember> Create(LdapMember member, string changedBy, CancellationToken cancellationToken = default)
        {
            member.Dn = $"cn={member.Id},{this._config.MemberDn}";
            await this._connection.Add(member, changedBy, cancellationToken);
            return member;
        }

        public Task<ICollection<LdapMember>> ListTribeMembers(Tribe tribe,
            CancellationToken cancellationToken = default)
        {
            return tribe.MemberIds.SelectAsync(m => this.Get(m, cancellationToken));
        }

        public async Task<ICollection<LdapMember>> ListVotedGroupMembers(VotedLdapGroup group, CancellationToken cancellationToken = default)
        {
            List<string> memberIds = new List<string>();
            group.ActiveVoteEntries.ToList().ForEach(m => memberIds.Add(m.MemberUid));
            group.InactiveVoteEntries.ToList().ForEach(m => memberIds.Add(m.MemberUid));
            // TODO: I'm pretty sure it is faster to load all members and filter them with LINQ in comparision to individual searches for each member id.
            ICollection<LdapMember> allMembers = await this._connection.Search<LdapMember>(this._config.MemberDn, null,
                LdapObjectTypes.Member, LdapConnection.SCOPE_ONE, LdapMember.LoadProperties, cancellationToken);

            return allMembers.Where(m => memberIds.Contains(m.Id)).ToList();
        }
    }
}