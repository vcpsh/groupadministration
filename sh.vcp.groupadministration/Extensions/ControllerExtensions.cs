using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using sh.vcp.identity.Claims;

namespace sh.vcp.groupadministration.Extensions
{
    /// <summary>
    /// Extensions for the controller class.
    /// </summary>
    public static class ControllerExtensions
    {
        /// <summary>
        /// Prints an error to the answer.
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="env"></param>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static ObjectResult Error(this Controller controller, IHostingEnvironment env, Exception ex)
        {
            if (env == null) throw new ArgumentNullException(nameof(env));
            if (ex == null) throw new ArgumentNullException(nameof(ex));
            
            return env.IsDevelopment() ? new ErrorObjectResult(ex.GetType().Namespace + ex.GetType().Name) : new ErrorObjectResult(ex);
        }

        public static ICollection<string> GetUserDivisions(this Controller controller)
        {
            return controller.User.Claims.Where(c => c.Type == LdapClaims.DivisionClaim || c.Type == LdapClaims.IsDivisionLgsClaim).Select(c => c.Value)
                .ToList();
        }

        private class ErrorObjectResult : ObjectResult
        {
            /// <inheritdoc />
            internal ErrorObjectResult(Exception ex) : base(ex)
            {
                this.StatusCode = 500;
            }

            /// <inheritdoc />
            internal ErrorObjectResult(string ex) : base(ex)
            {
                this.StatusCode = 500;
            }
        }
    }
}