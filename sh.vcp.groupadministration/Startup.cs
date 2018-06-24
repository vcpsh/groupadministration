using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Swagger;
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

            // configure redis cache
//            services.AddDistributedRedisCache(options =>
//            {
//                options.Configuration = "localhost";
//                options.InstanceName = "cache";
//            });

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
            services.AddMvcCore(/*options => options.AddMetricsResourceFilter()*/)
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

//            app.UseMetricsPostAndPutSizeTrackingMiddleware();
//            app.UseMetricsErrorTrackingMiddleware();
//            app.UseMetricsRequestTrackingMiddleware();
//            app.UseMetricsActiveRequestMiddleware();
            app.UseCors("sso-backend");

//            app.UseSwagger();
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}