using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using sh.vcp.identity.Model;
using sh.vcp.identity.Model.Tribe;

namespace sh.vcp.groupadministration.dal.Managers
{
    /// <summary>
    /// Manager to do member related ldap stuff (LdapMember/LdapUser).
    /// </summary>
    public interface IMemberManager
    {
        /// <summary>
        /// Loads all members of a division and returns them.
        /// </summary>
        /// <param name="divisionId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>Collection of members</returns>
        Task<ICollection<LdapMember>> ListDivisionMembers(string divisionId, CancellationToken cancellationToken = default );

        /// <summary>
        /// Loads all members of a tribe special group (lr, lv, sl, gs)
        /// </summary>
        /// <param name="tribe"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<ICollection<LdapMember>> ListTribeSpecialMembers(Tribe tribe,
            CancellationToken cancellationToken = default);
        
        /// <summary>
        /// Loads a member with a given id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="cancellationToken"></param>
        /// <returns>member or <code>null</code> if no such member exists</returns>
        Task<LdapMember> Get(string id, CancellationToken cancellationToken = default );
        
        /// <summary>
        /// Creates a new member.
        /// </summary>
        /// <param name="member">Member to create.</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<LdapMember> Create(LdapMember member, CancellationToken cancellationToken = default );

        Task<ICollection<LdapMember>> ListTribeMembers(Tribe tribe, CancellationToken cancellationToken = default);
    }
}