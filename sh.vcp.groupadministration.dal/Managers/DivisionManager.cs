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
    internal class DivisionManager: IDivisionManager
    {
        private readonly ILdapConnection _connection;
        private readonly LdapConfig _config;

        public DivisionManager(ILdapConnection connection, LdapConfig config)
        {
            this._connection = connection;
            this._config = config;
        }
        
        public async Task<ICollection<Division>> List(ICollection<string> memberOf, CancellationToken cancellationToken = default)
        {
            ICollection<Division> divisions = await this._connection.Search<Division>(this._config.GroupDn, null, LdapObjectTypes.Division, LdapConnection.SCOPE_SUB,
                Division.LoadProperties, cancellationToken);
            return divisions.Where(d => memberOf.Contains(d.Id)).ToList();
        }
    }
}