using SkincareBookingService.DAL.Entities;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IAuthService
    {
        Task<Account> AuthenticateAsync(string accountName, string password);
    }
}
