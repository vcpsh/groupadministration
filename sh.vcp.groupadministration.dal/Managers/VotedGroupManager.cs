using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Novell.Directory.Ldap;
using sh.vcp.groupadministration.dal.Extensions;
using sh.vcp.identity.Model;
using sh.vcp.identity.Models;
using sh.vcp.ldap;
using ILdapConnection = sh.vcp.ldap.ILdapConnection;

namespace sh.vcp.groupadministration.dal.Managers
{
    public class VotedGroupManager : IVotedGroupManager
    {
        private readonly LdapConfig _config;
        private readonly ILdapConnection _connection;

        public VotedGroupManager(ILdapConnection connection, LdapConfig config)
        {
            this._connection = connection;
            this._config = config;
        }

        public async Task<ICollection<VotedLdapGroup>> List(CancellationToken cancellationToken = default)
        {
            ICollection<VotedLdapGroup> groups = await this._connection.Search<VotedLdapGroup>(this._config.GroupDn,
                null, LdapObjectTypes.VotedGroup, LdapConnection.SCOPE_SUB,
                VotedLdapGroup.LoadProperties, cancellationToken);
            return groups.ToList();
        }

        public async Task<VotedLdapGroup> Create(VotedLdapGroup group, CancellationToken cancellationToken = default)
        {
            return await this._connection.Add(group, cancellationToken);
        }

        public Task<VotedLdapGroup> Get(string dn, CancellationToken cancellationToken = default)
        {
            return this._connection.Read<VotedLdapGroup>(dn, cancellationToken);
        }

        public async Task<VotedLdapGroup> AddMembers(VotedLdapGroup group, string startEvent, string endEvent, DateTime startDate, List<string> newMembers,
            CancellationToken cancellationToken)
        {
            await newMembers.ForEachAsync(async m =>
            {
                var id = $"{m}_{DateTime.Now:yyyyMMddHHmmss}";
                var voteEntry = new VoteEntry
                {
                    Id = id,
                    Dn = $"cn={id},{group.Dn}",
                    MemberUid = m,
                    Active = true,
                    VoteStartEvent = startEvent,
                    VoteEndEvent = endEvent,
                    VoteStartDate = startDate,
                    
                };
                await this._connection.Add(voteEntry, cancellationToken);
                group.ActiveVoteEntries.Add(voteEntry);
                group.MemberIds.Add(m);
            });
            await this._connection.Update(group, cancellationToken);
            return group;
        }

        public async Task<VotedLdapGroup> RemoveMembers(VotedLdapGroup group, string endEvent, DateTime endDate, List<VoteEntry> removedMembers,
            CancellationToken cancellationToken = default)
        {
            await removedMembers.ForEachAsync(async m =>
            {
                m.VoteEndDate = endDate;
                m.VoteEndEvent = endEvent;
                m.Active = false;
                await this._connection.Update(m, cancellationToken);
                group.MemberIds.Remove(m.MemberUid);
                group.ActiveVoteEntries.Remove(m);
                group.InactiveVoteEntries.Add(m);
            });
            await this._connection.Update(group, cancellationToken);
            return group;
        }
    }
}