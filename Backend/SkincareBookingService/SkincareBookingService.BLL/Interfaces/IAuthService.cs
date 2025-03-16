using SkincareBookingService.BLL.DTOs.AccountDTOs;
using SkincareBookingService.DAL.Entities;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IAuthService
    {
        Task<Account> AuthenticateAsync(string accountName, string password);

        Task<AccountDTO> RegisterAsync(string accountName, string email, string password);

        Task SendEmailAsync(string to, string subject, string body);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> VerifyOtpAsync(string email, string otp);

        Task<bool> ResetPasswordAsync(string email, string otp, string newPassword);

    }
}
