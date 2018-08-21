using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using sh.vcp.identity.Model.Tribe;

namespace sh.vcp.groupadministration.dal.Managers
{
    public interface ITribeManager
    {
        Task<Tribe> Get(int tribeId, CancellationToken cancellationToken = default);
        Task<Tribe> GetByDn(string dn, CancellationToken cancellationToken = default);
        Task<ICollection<Tribe>> List(CancellationToken cancellationToken = default);
        Task<Tribe> Create(Tribe tribe, CancellationToken cancellationToken = default);
    }
}