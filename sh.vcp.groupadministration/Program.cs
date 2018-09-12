using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Program.BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var webRoot = Path.Combine(Directory.GetCurrentDirectory(), config.GetValue<string>("WebRootFolder"));

            return WebHost.CreateDefaultBuilder(args)
//                .ConfigureMetricsWithDefaults(
//                    builder =>
//                    {
//                        builder.OutputMetrics.AsPrometheusPlainText();
//                    })
//                .UseMetrics(options =>
//                {
//                    options.EndpointOptions = endpointsOptions =>
//                    {
//                        endpointsOptions.MetricsTextEndpointOutputFormatter =
//                            new MetricsPrometheusTextOutputFormatter();
//                        endpointsOptions.MetricsEndpointOutputFormatter =
//                            new MetricsPrometheusTextOutputFormatter();
//                    };
//                })
                .UseConfiguration(config)
                .UseKestrel()
                .UseWebRoot(webRoot)
                .UseStartup<Startup>()
                .Build();
        }
    }
}