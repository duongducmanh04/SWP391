using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class AccountService : IAccountService
    {
        private readonly IGenericRepository<Account> _accountRepository;

        public AccountService(IGenericRepository<Account> accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<AccountDTO> GetAccountByIdAsync(int accountId)
        {
            var account = (await _accountRepository.FindAsync(a => a.AccountId == accountId)).FirstOrDefault();

            return new AccountDTO
            {
                AccountId = account.AccountId,
                AccountName = account.AccountName,
                Password = account.Password,
                Role = account.Role,
                Active = account.Active
            };
        }

        public async Task<List<AccountDTO>> GetAccountByRoleAsync(string role)
        {
            var accounts = await _accountRepository.FindAsync(a => a.Role == role);

            return accounts.Select(a => new AccountDTO
            {
                AccountId = a.AccountId,
                AccountName = a.AccountName,
                Password = a.Password,
                Role = a.Role,
                Active = a.Active
            }).ToList();
        }

        public async Task<List<AccountDTO>> GetAllAccountAsync()
        {
            var accounts = await _accountRepository.GetAllAsync();

            return accounts.Select(a => new AccountDTO
            {
                AccountId = a.AccountId,
                AccountName = a.AccountName,
                Password = a.Password,
                Role = a.Role,
                Active = a.Active
            }).ToList();
        }
    }
}
