using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Novell.Directory.Ldap;
using sh.vcp.identity.Models;
using sh.vcp.ldap;
using sh.vcp.ldap.Exceptions;
using ILdapConnection = sh.vcp.ldap.ILdapConnection;

namespace sh.vcp.groupadministration.dal.Managers
{
    internal class DivisionManager : IDivisionManager
    {
        private readonly LdapConfig _config;
        private readonly ILdapConnection _connection;

        public DivisionManager(ILdapConnection connection, LdapConfig config)
        {
            this._connection = connection;
            this._config = config;
        }

        public async Task<ICollection<Division>> List(CancellationToken cancellationToken = default)
        {
            ICollection<Division> divisions = await this._connection.Search<Division>(this._config.GroupDn, null,
                LdapObjectTypes.Division, LdapConnection.SCOPE_SUB,
                Division.LoadProperties, cancellationToken);
            return divisions;
        }

        public async Task<Division> Get(string divisionId, CancellationToken cancellationToken = default)
        {
            ICollection<Division> divisions = await this._connection.Search<Division>(this._config.GroupDn,
                $"cn={divisionId}", LdapObjectTypes.Division,
                LdapConnection.SCOPE_SUB, Division.LoadProperties, cancellationToken);

            if (divisions.Count > 1) throw new LdapSearchNotUniqueException($"cn={divisionId}", divisions.Count);

            return divisions.FirstOrDefault();
        }
    }
}