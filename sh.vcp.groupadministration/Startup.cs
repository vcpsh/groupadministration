﻿using System.IO;
using System.Reflection;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NETCore.MailKit.Extensions;
using NETCore.MailKit.Infrastructure.Internal;
using sh.vcp.groupadministration.dal.Extensions;
using sh.vcp.identity.Extensions;
using sh.vcp.ldap.Extensions;

namespace Server
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            this._configuration = configuration;
            this._env = env;
        }

        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _env;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            if (!this._env.IsDevelopment()) {
                services.AddDataProtection()
                    .PersistKeysToFileSystem(new DirectoryInfo("/keys/"));  
            }

            services.AddLogging(config =>
            {
                config.AddConfiguration(this._configuration);
                config.AddConsole();
            });
                      
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            services.AddVcpShLdap(this._configuration,
                builder => builder.UseMySql(this._configuration.GetConnectionString("ChangeTracking"),
                    sql => sql.MigrationsAssembly(migrationsAssembly)));
            services.AddVcpShIdentity();
            services.AddVcpShGroupAdministrationDal();

            // configure proxy stuff
            if (this._configuration.GetValue("Proxy", false)) {
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                    options.RequireHeaderSymmetry = false;
                });
            }

            // configure smtp
            services.AddMailKit(optionsBuilder =>
            {
                var options = new MailKitOptions();
                this._configuration.GetSection("Mail").Bind(options);
                optionsBuilder.UseMailKit(options);
            });

            services.AddAuthentication(o =>
            {
                o.DefaultScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
                o.DefaultAuthenticateScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
            }).AddIdentityServerAuthentication(options =>
            {
                this._configuration.GetSection("Authentication").Bind(options);
            });

            // additional configuration
            services.AddMvc(options =>
                {
//                    if (!this._env.IsDevelopment()) {
//                        options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
//                    }

//            options.AddMetricsResourceFilter()
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddCors(options =>
            {
                options.AddPolicy("sso-backend", policy =>
                {
                    policy
                        .WithOrigins(this._configuration.GetSection("Authentication")["Authority"])
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

//            if (!this._env.IsDevelopment()) {
//                services.AddAntiforgery(options =>
//                {
//                    options.HeaderName = "X-XSRF-TOKEN";
//                });
//            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/1.0.0/swagger.json", "sh.vcp.gruppenverwaltung@1.0.0");
                });
            }
            else {
                app.UseHsts();
            }

            if (this._configuration.GetValue("Proxy", false)) {
                app.UseForwardedHeaders();
            }

            app.UseCors("sso-backend");
            app.UseAuthentication();
            app.UseMvc();
            app.Use(async (ctx, next) =>
            {
                await next();
                var path = ctx.Request.Path;
//                if (!this._env.IsDevelopment() && (
//                        string.Equals(path, "/", StringComparison.OrdinalIgnoreCase) ||
//                        string.Equals(path, "/index.html", StringComparison.OrdinalIgnoreCase) ||
//                        ctx.Response.StatusCode == StatusCodes.Status404NotFound)) {
//                    var antiforgery = app.ApplicationServices.GetService<IAntiforgery>();
//                    var tokens = antiforgery.GetAndStoreTokens(ctx);
//                    ctx.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken,
//                        new CookieOptions() {HttpOnly = false});
//                }

                if (ctx.Response.StatusCode == 404) {
                    ctx.Response.StatusCode = 200;
                    ctx.Response.ContentType = "text/html";
                    await ctx.Response.SendFileAsync(Path.Combine(this._env.WebRootPath, "index.html"));
                }
            });
            if (bool.TryParse(this._configuration["SpaProxy"], out var spaProxy) && spaProxy) {
                app.UseSpa(spa => { spa.UseProxyToSpaDevelopmentServer("http://localhost:4200"); });
            }
            else {
                app.UseStaticFiles();
            }
//            app.UseMetricsPostAndPutSizeTrackingMiddleware();
//            app.UseMetricsErrorTrackingMiddleware();
//            app.UseMetricsRequestTrackingMiddleware();
//            app.UseMetricsActiveRequestMiddleware();
        }
    }
}