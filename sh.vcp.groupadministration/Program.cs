using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Program.BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
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
                .UseStartup<Startup>()
                .UseKestrel()
                .Build();
    }
}