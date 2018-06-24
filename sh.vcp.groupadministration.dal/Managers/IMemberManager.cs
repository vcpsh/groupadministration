using System.Threading;
using System.Threading.Tasks;
using sh.vcp.identity.Model;

namespace sh.vcp.groupadministration.dal.Managers
{
    public interface IMemberManager
    {
        Task<object> ListIds(CancellationToken cancellationToken = default );
        Task<object> List(CancellationToken cancellationToken = default );
        Task<LdapMember> Get(string id, CancellationToken cancellationToken = default );
        Task<LdapMember> Create(LdapMember member, CancellationToken cancellationToken = default );
    }
}