﻿using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Novell.Directory.Ldap;
using sh.vcp.identity.Model.Tribe;
using sh.vcp.ldap;
using sh.vcp.ldap.Exceptions;
using ILdapConnection = sh.vcp.ldap.ILdapConnection;

namespace sh.vcp.groupadministration.dal.Managers
{
    internal class TribeManager : ITribeManager
    {
        private readonly LdapConfig _config;
        private readonly ILdapConnection _connection;

        public TribeManager(ILdapConnection connection, LdapConfig config)
        {
            this._connection = connection;
            this._config = config;
        }

        public async Task<Tribe> Get(int tribeId, CancellationToken cancellationToken = default)
        {
            ICollection<Tribe> tribes = await this._connection.Search<Tribe>(this._config.GroupDn,
                $"{LdapProperties.DepartmentId}={tribeId}", LdapObjectTypes.Tribe,
                LdapConnection.SCOPE_SUB, Tribe.LoadProperties, cancellationToken);

            if (tribes.Count > 1)
                throw new LdapSearchNotUniqueException($"{LdapProperties.DepartmentId}={tribeId}", tribes.Count);
            return tribes.FirstOrDefault();
        }

        public async Task<Tribe> GetByDn(string dn, CancellationToken cancellationToken = default)
        {
            var tribe = await this._connection.Read<Tribe>(dn, cancellationToken);
            return tribe;
        }

        public async Task<ICollection<Tribe>> List(CancellationToken cancellationToken = default)
        {
            ICollection<Tribe> tribes = await this._connection.Search<Tribe>(this._config.GroupDn, null,
                LdapObjectTypes.Tribe, LdapConnection.SCOPE_SUB,
                Tribe.LoadProperties, cancellationToken);
            return tribes;
        }

        public async Task<Tribe> Create(Tribe tribe, string changedBy, CancellationToken cancellationToken = default)
        {
            tribe.Gs = new TribeGs
            {
                DisplayName = $"{tribe.DisplayName} Geschäftsstelle",
                Dn = $"cn={tribe.Id}_gs,{tribe.Dn}",
                Id = $"{tribe.Id}_gs",
                DivisionId = tribe.DivisionId
            };
            tribe.Sl = new TribeSl
            {
                DisplayName = $"{tribe.DisplayName} Stammesleitung",
                Dn = $"cn={tribe.Id}_sl,{tribe.Dn}",
                Id = $"{tribe.Id}_sl",
                DivisionId = tribe.DivisionId
            };
            tribe.Lr = new TribeLr
            {
                DisplayName = $"{tribe.DisplayName} Landesrat",
                Dn = $"cn={tribe.Id}_lr,{tribe.Dn}",
                Id = $"{tribe.Id}_lr",
                DivisionId = tribe.DivisionId
            };
            tribe.Lv = new TribeLv
            {
                DisplayName = $"{tribe.DisplayName} Landesversammlung",
                Dn = $"cn={tribe.Id}_lv,{tribe.Dn}",
                Id = $"{tribe.Id}_lv",
                DivisionId = tribe.DivisionId
            };

            await this._connection.Add(tribe, changedBy, cancellationToken);
            await this._connection.AddChildren(tribe, changedBy, cancellationToken);

            return tribe;
        }
    }
}