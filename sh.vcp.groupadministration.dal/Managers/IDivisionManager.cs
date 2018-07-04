using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using sh.vcp.identity.Models;

namespace sh.vcp.groupadministration.dal.Managers
{
    public interface IDivisionManager
    {
        Task<ICollection<Division>> List(CancellationToken cancellationToken = default);
        Task<Division> Get(string divisionId, CancellationToken cancellationToken = default);
    }
}