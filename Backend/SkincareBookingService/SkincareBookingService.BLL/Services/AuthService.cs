using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<Account> _accountRepository;

        public AuthService(IGenericRepository<Account> accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<Account?> AuthenticateAsync(string accountName, string password)
        {
            return await _accountRepository.FirstOrDefaultAsync(a => a.AccountName == accountName && a.Password == password);
        }
    }
}
