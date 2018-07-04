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
                ICollection<Division> divisions = await this._manager.List(cancellationToken);
                return this.Ok(divisions.Where(d => userDivisions.Contains(d.Id)));
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(DivisionController) + nameof(this.List));
                return this.Error(this._env, ex);
            }
        }
        
        [HttpGet("{id}")]
        [SwaggerResponse(200, typeof(Division))]
        public async Task<IActionResult> Get(string id, CancellationToken cancellationToken)
        {
            try
            {
                if (!this.GetUserDivisions().Contains(id))
                {
                    return this.Unauthorized();
                }
                var division = await this._manager.Get(id, cancellationToken);
                return this.Ok(division);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, nameof(DivisionController) + nameof(this.Get));
                return this.Error(this._env, ex);
            }
        }
    }
}