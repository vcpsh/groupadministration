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

        public async Task<VotedLdapGroup> Create(VotedLdapGroup group, string changedBy, CancellationToken cancellationToken = default)
        {
            return await this._connection.Add(group, changedBy, cancellationToken);
        }

        public Task<VotedLdapGroup> Get(string dn, CancellationToken cancellationToken = default)
        {
            return this._connection.Read<VotedLdapGroup>(dn, cancellationToken);
        }

        public async Task<VotedLdapGroup> AddMembers(VotedLdapGroup group, string startEvent, string endEvent, DateTime startDate, List<string> newMembers, string changedBy,
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
                await this._connection.Add(voteEntry, changedBy, cancellationToken);
                group.ActiveVoteEntries.Add(voteEntry);
                group.MemberIds.Add(m);
            });
            await this._connection.Update(group, changedBy, cancellationToken);
            return group;
        }

        public async Task<VotedLdapGroup> RemoveMembers(VotedLdapGroup group, string endEvent, DateTime endDate, List<VoteEntry> removedMembers, string changedBy,
            CancellationToken cancellationToken = default)
        {
            await removedMembers.ForEachAsync(async m =>
            {
                m = await this._connection.Read<VoteEntry>(m.Dn, cancellationToken);
                m.VoteEndDate = endDate;
                m.VoteEndEvent = endEvent;
                m.Active = false;
                await this._connection.Update(m, changedBy, cancellationToken);
                group.MemberIds.Remove(m.MemberUid);
                group.ActiveVoteEntries.Remove(group.ActiveVoteEntries.First(ve => ve.Dn == m.Dn));
                group.InactiveVoteEntries.Add(m);
            });
            await this._connection.Update(group, changedBy, cancellationToken);
            return group;
        }
    }
}