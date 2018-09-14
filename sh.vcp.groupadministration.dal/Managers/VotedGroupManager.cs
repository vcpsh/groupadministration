﻿using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Novell.Directory.Ldap;
using sh.vcp.identity.Models;
using sh.vcp.ldap;
using ILdapConnection = sh.vcp.ldap.ILdapConnection;

namespace sh.vcp.groupadministration.dal.Managers
{
    public class VotedGroupManager : IVotedGroupManager
    {
        private readonly LdapConfig _config;
        private readonly ILdapConnection _connection;

        public VotedGroupManager(ILdapConnection connection, LdapConfig config)
        {
            this._connection = connection;
            this._config = config;
        }

        public async Task<ICollection<VotedLdapGroup>> List(CancellationToken cancellationToken = default)
        {
            ICollection<VotedLdapGroup> groups = await this._connection.Search<VotedLdapGroup>(this._config.GroupDn,
                null, LdapObjectTypes.VotedGroup, LdapConnection.SCOPE_SUB,
                VotedLdapGroup.LoadProperties, cancellationToken);
            return groups.ToList();
        }

        public async Task<VotedLdapGroup> Create(VotedLdapGroup group, CancellationToken cancellationToken = default)
        {
            return await this._connection.Add(group, cancellationToken);
        }
    }
}