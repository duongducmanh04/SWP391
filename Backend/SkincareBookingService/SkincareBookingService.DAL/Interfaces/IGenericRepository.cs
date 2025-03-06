using SkincareBookingService.DAL.Entities;
using System.Linq.Expressions;

namespace SkincareBookingService.DAL.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        IQueryable<T> Query();
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task SaveChangesAsync();
        Task<IEnumerable<object>> GetListAsync(Func<object, bool> value);

        Task<List<Account>> FindAsync(Expression<Func<Account, bool>> predicate, string include = "");
    }
}
