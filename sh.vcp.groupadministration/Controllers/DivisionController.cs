using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sh.vcp.groupadministration.dal.Managers;
using sh.vcp.groupadministration.Extensions;
using sh.vcp.identity.Claims;
using sh.vcp.identity.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/divisions")]
    public class DivisionController: Controller
    {
        private readonly IDivisionManager _manager;
        private readonly ILogger<DivisionController> _logger;
        private readonly IHostingEnvironment _env;

        public DivisionController(IDivisionManager manager, ILogger<DivisionController> logger, IHostingEnvironment env)
        {
            this._manager = manager;
            this._logger = logger;
            this._env = env;
        }

        [HttpGet]
        [SwaggerResponse(200, typeof(ICollection<Division>))]
        public async Task<IActionResult> List(CancellationToken cancellationToken)
        {
            try
            {
                ICollection<string> userDivisions = this.GetUserDivisions();
                return this.Ok(await this._manager.List(userDivisions, cancellationToken));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(DivisionController) + nameof(this.List));
                return this.Error(this._env, ex);
            }
        }
    }
}