using System;
using Newtonsoft.Json;
using sh.vcp.identity.Model;

namespace sh.vcp.groupadministration.dal.Model
{
    /// <summary>
    ///     A model class for users that allowes partial serialisation.
    /// </summary>
    public class WireMember
    {
        /// <summary>
        ///     Enum for the types of wire user we have.
        /// </summary>
        public enum UserType
        {
            /// <summary>
            ///     Include all properties. Use it only for the user or the admin on import
            /// </summary>
            FullUser,

            /// <summary>
            ///     User with basic contact information.
            /// </summary>
            ContactUser,

            /// <summary>
            ///     Include only the id, name and username.
            /// </summary>
            MinimalUser
        }

        public WireMember()
        {
        }

        public WireMember(LdapMember member, UserType type)
        {
            switch (type)
            {
                case UserType.FullUser:
                case UserType.ContactUser:
                case UserType.MinimalUser:
                    this.Id = member.Id;
                    this.Dn = member.Dn;
                    this.UserName = member.UserName;
                    this.FirstName = member.FirstName;
                    this.LastName = member.LastName;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(type), type, null);
            }
        }

        [JsonProperty("Id")]
        public string Id { get; set; }

        [JsonProperty("Dn")]
        public string Dn { get; set; }

        [JsonProperty("Type")]
        public UserType Type { get; set; }

        [JsonProperty("Username")]
        public string UserName { get; set; }

        [JsonProperty("FirstName")]
        public string FirstName { get; set; }

        [JsonProperty("LastName")]
        public string LastName { get; set; }
    }
}