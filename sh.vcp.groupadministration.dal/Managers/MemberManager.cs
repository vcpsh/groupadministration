using System.Threading;
using System.Threading.Tasks;
using sh.vcp.identity.Model;

namespace sh.vcp.groupadministration.dal.Managers
{
    internal class MemberManager: IMemberManager
    {
        public Task<object> ListIds(CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }

        public Task<object> List(CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }

        public Task<LdapMember> Get(string id, CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }

        public Task<LdapMember> Create(LdapMember member, CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }
    }
}