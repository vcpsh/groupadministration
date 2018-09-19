using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Novell.Directory.Ldap;
using sh.vcp.identity.Models;
using sh.vcp.ldap;
using ILdapConnection = sh.vcp.ldap.ILdapConnection;

namespace sh.vcp.groupadministration.dal.Managers
{
    internal class GroupManager: IGroupManager
    {
        private readonly ILdapConnection _connection;
        private readonly LdapConfig _config;

        public GroupManager(ILdapConnection connection, LdapConfig config)
        {
            this._connection = connection;
            this._config = config;
        }
        
        public Task<bool> SetMembers<TModel>(TModel model, CancellationToken cancellationToken = default) where TModel: LdapGroup, new()
        {
            IEnumerable<LdapModification> memberUidModifications =
                model.GetModifications().Where(mod => mod.Attribute.Name == LdapProperties.Member);
            
            return this._connection.Update<TModel>(model.Dn, memberUidModifications.ToArray(), cancellationToken);
        }

        public Task<object> GetMembers(string dn, CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }

        public Task<LdapGroup> Get(string dn, CancellationToken cancellationToken = default)
        {
            return this._connection.Read<LdapGroup>(dn, cancellationToken);
        }
    }
}