using System.IO;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
        public Startup(IConfiguration configuration, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            this._configuration = configuration;
            this._env = env;
            loggerFactory.AddConsole(this._configuration.GetSection("Logging"));
        }

        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _env;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddVcpShLdap(this._configuration);
            services.AddVcpShIdentity();
            services.AddVcpShGroupAdministrationDal();

            if (this._env.IsProduction())
            {
                services.Configure<MvcOptions>(options => { options.Filters.Add(new RequireHttpsAttribute()); });
            }

            // configure proxy stuff
            if (this._configuration.GetValue("Proxy", false))
            {
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                    options.RequireHeaderSymmetry = false;
                });
            }

            services.AddAntiforgery(options => { options.HeaderName = "X-XSRF-TOKEN"; });

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
            services.AddMvcCore( /*options => options.AddMetricsResourceFilter()*/)
                .AddAuthorization()
                .AddApiExplorer()
                .AddDataAnnotations()
                .AddFormatterMappings()
                .AddJsonFormatters(builder => { builder.ReferenceLoopHandling = ReferenceLoopHandling.Ignore; });

            services.AddMvc();

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

            // Register the Swagger generator, defining one or more Swagger documents
//            services.AddSwaggerGen(c =>
//            {
//                c.SwaggerDoc("1.0.0", new Info {Title = "sh.vcp.gruppenverwaltung", Version = "1.0.0"});
//            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/1.0.0/swagger.json", "sh.vcp.gruppenverwaltung@1.0.0");
                });
            }
            else
            {
                app.UseHsts();
            }

            if (this._configuration.GetValue("Proxy", false))
            {
                app.UseForwardedHeaders();
            }

            app.UseCors("sso-backend");
            app.Use(async (ctx, next) =>
            {
                await next();
                if (ctx.Response.StatusCode == 404 || ctx.Request.Path == "/")
                {
                    var antiforgery = app.ApplicationServices.GetService<IAntiforgery>();
                    var tokens = antiforgery.GetAndStoreTokens(ctx);
                    ctx.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken,
                        new CookieOptions() {HttpOnly = false, Path = "/"});
                }

                if (ctx.Response.StatusCode == 404)
                {
                    ctx.Response.StatusCode = 200;
                    ctx.Response.ContentType = "text/html";
                    await ctx.Response.SendFileAsync(Path.Combine(this._env.WebRootPath, "index.html"));
                }
            });
            app.UseDefaultFiles();
            app.UseStaticFiles();
//            app.UseMetricsPostAndPutSizeTrackingMiddleware();
//            app.UseMetricsErrorTrackingMiddleware();
//            app.UseMetricsRequestTrackingMiddleware();
//            app.UseMetricsActiveRequestMiddleware();

//            app.UseSwagger();
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}