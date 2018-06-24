using System.Threading;
using System.Threading.Tasks;

namespace sh.vcp.groupadministration.dal.Managers
{
    internal class GroupManager: IGroupManager
    {
        public Task<object> SetMembers(string dn, string[] nextMembers, CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }

        public Task<object> GetMembers(string dn, CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }

        public Task<object> Get(string dn, CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }
    }
}