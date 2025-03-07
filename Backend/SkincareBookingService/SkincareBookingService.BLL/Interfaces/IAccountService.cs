using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IAccountService
    {
        Task<List<AccountDTO>> GetAllAccountAsync();

        Task<List<AccountDTO>> GetAccountByRoleAsync(string role);

        Task<List<AccountDTO>> GetAccountByIdAndRoleAsync(int accountId, string role);

        Task<AccountDTO> GetAccountByIdAsync(int accountId);
    }
}
