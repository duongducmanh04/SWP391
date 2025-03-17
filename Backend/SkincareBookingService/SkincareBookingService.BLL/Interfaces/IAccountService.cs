using SkincareBookingService.BLL.DTOs.AccountDTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IAccountService
    {
        Task<CreateAccountDTO> CreateAccountAsync(CreateAccountDTO account);

        Task<List<AccountDTO>> GetAllAccountAsync();

        Task<bool> GetAccountByAccountNameAndEmail(string accountName, string email);

        Task<List<AccountDTO>> GetAccountByRoleAsync(string role);

        Task<List<AccountDTO>> GetAccountByIdAndRoleAsync(int accountId, string role);

        Task<AccountDTO> GetAccountByIdAsync(int accountId);

        Task<bool> UpdateAccountAsync(AccountDTO account);

        Task<bool> UpdateAccountPasswordAsync(int accountId, string password);

        Task<bool> DeleteAccountAsync(int accountId);
    }
}
