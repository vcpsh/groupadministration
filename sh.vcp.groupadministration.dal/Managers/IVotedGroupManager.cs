using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using sh.vcp.identity.Models;

namespace sh.vcp.groupadministration.dal.Managers
{
    public interface IVotedGroupManager
    {
        Task<ICollection<VotedLdapGroup>> List(CancellationToken cancellationToken = default);
    }
}