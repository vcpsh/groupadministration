using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Novell.Directory.Ldap;
using sh.vcp.identity.Model;
using sh.vcp.ldap;
using ILdapConnection = sh.vcp.ldap.ILdapConnection;

namespace sh.vcp.groupadministration.dal.Managers
{
    internal class MemberManager: IMemberManager
    {
        private readonly ILdapConnection _connection;
        private readonly LdapConfig _config;
        private readonly IDivisionManager _divisionManager;

        public MemberManager(ILdapConnection connection, LdapConfig config, IDivisionManager divisionManager)
        {
            this._connection = connection;
            this._config = config;
            this._divisionManager = divisionManager;
        }
        
        public async Task<ICollection<LdapMember>> ListDivisionMembers(string divisionId, CancellationToken cancellationToken = default)
        {
            var division = await this._divisionManager.Get(divisionId, cancellationToken);
            if (division == null)
            {
                return  new List<LdapMember>();
            }
            // TODO: I'm pretty shure it is faster to load all members and filter them with LINQ in comparision to individual searches for each member id.
            ICollection<LdapMember> allMembers = await this._connection.Search<LdapMember>(this._config.MemberDn, null,
                LdapObjectTypes.Member, LdapConnection.SCOPE_ONE, LdapMember.LoadProperties, cancellationToken);

            return allMembers.Where(m => division.MemberIds.Contains(m.Id)).ToList();
        }

        public Task<LdapMember> Get(string id, CancellationToken cancellationToken = default)
        {
            throw new System.NotImplementedException();
        }

        public async Task<LdapMember> Create(LdapMember member, CancellationToken cancellationToken = default)
        {
            member.Dn = $"cn={member.Id},{this._config.MemberDn}";
            await this._connection.Add(member, cancellationToken);
            return member;
        }
    }
}