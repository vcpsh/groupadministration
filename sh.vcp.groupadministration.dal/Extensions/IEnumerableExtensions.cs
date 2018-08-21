using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace sh.vcp.groupadministration.dal.Extensions
{
    internal static class IEnumerableExtensions
    {
        public static async Task ForEachAsync<T>(this IEnumerable<T> list, Func<T, Task> func)
        {
            foreach (var val in list) await func(val);
        }

        public static async Task<ICollection<Out>> SelectAsync<In, Out>(this IEnumerable<In> list,
            Func<In, Task<Out>> func)
        {
            ICollection<Out> selected = new List<Out>();
            foreach (var val in list) selected.Add(await func(val));

            return selected;
        }
    }
}