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

        public async Task<Account> RegisterAsync(string accountName, string password)
        {
            var account = new Account
            {
                AccountName = accountName,
                Password = password,
                Role = "Customer",
                Active = true
            };

            await _accountRepository.AddAsync(account);
            await _accountRepository.SaveChangesAsync();
            return account;
        }
    }
}
