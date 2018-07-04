using System.Threading;
using System.Threading.Tasks;
using sh.vcp.identity.Models;

namespace sh.vcp.groupadministration.dal.Managers
{
    public interface IGroupManager
    {
        Task<bool> SetMembers<TModel>(TModel model, CancellationToken cancellationToken = default)
            where TModel : LdapGroup;
        Task<object> GetMembers(string dn, CancellationToken cancellationToken = default);
        Task<object> Get(string dn, CancellationToken cancellationToken = default);
    }
}