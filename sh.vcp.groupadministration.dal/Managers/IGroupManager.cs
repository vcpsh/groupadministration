using System.Threading;
using System.Threading.Tasks;

namespace sh.vcp.groupadministration.dal.Managers
{
    public interface IGroupManager
    {
        Task<object> SetMembers(string dn, string[] nextMembers, CancellationToken cancellationToken = default );
        Task<object> GetMembers(string dn, CancellationToken cancellationToken = default);
        Task<object> Get(string dn, CancellationToken cancellationToken = default);
    }
}