using Microsoft.Extensions.DependencyInjection;
using sh.vcp.groupadministration.dal.Managers;

namespace sh.vcp.groupadministration.dal.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddVcpShGroupAdministrationDal(this IServiceCollection services)
        {
            services.AddTransient<IDivisionManager, DivisionManager>();
            services.AddTransient<IVotedGroupManager, VotedGroupManager>();
            services.AddTransient<IGroupManager, GroupManager>();
            services.AddTransient<IMemberManager, MemberManager>();
            services.AddTransient<ITribeManager, TribeManager>();
        }
    }
}