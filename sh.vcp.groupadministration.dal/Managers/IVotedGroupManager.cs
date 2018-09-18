using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using sh.vcp.identity.Model;
using sh.vcp.identity.Models;

namespace sh.vcp.groupadministration.dal.Managers
{
    public interface IVotedGroupManager
    {
        Task<ICollection<VotedLdapGroup>> List(CancellationToken cancellationToken = default);
        Task<VotedLdapGroup> Create(VotedLdapGroup group, CancellationToken cancellationToken = default);
        Task<VotedLdapGroup> Get(string dn, CancellationToken cancellationToken = default);
        Task<VotedLdapGroup> AddMembers(VotedLdapGroup group, string startEvent, string endEvent, DateTime startDate, List<string> newMembers, CancellationToken cancellationToken = default);
        Task<VotedLdapGroup> RemoveMembers(VotedLdapGroup group, string endEvent, DateTime endDate, List<VoteEntry> removedMembers, CancellationToken cancellationToken = default);
    }
}