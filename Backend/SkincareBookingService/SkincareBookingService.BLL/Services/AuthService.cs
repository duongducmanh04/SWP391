using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;
using System.Collections.Concurrent;

namespace SkincareBookingService.BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<Account> _accountRepository;
        private readonly IEmailService _emailService;
        private static readonly ConcurrentDictionary<string, (string Otp, DateTime Expires)> OtpStore = new();

        public AuthService(IGenericRepository<Account> accountRepository, IEmailService emailService)
        {
            _accountRepository = accountRepository;
            _emailService = emailService;
        }

        public async Task<Account> AuthenticateAsync(string accountName, string password)
        {
            return await _accountRepository.FirstOrDefaultAsync(a => a.AccountName == accountName && a.Password == password);
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var account = await _accountRepository.FirstOrDefaultAsync(a => a.Customers.Any(c => c.Email == email) || a.SkinTherapists.Any(st => st.Email == email));
            if (account == null) return false;

            var otp = GenerateOtp();
            var expires = DateTime.UtcNow.AddMinutes(10);
            OtpStore[email] = (otp, expires);

            await _emailService.SendEmailAsync(email, "Password Reset OTP", $"Your OTP is: {otp}");

            return true;
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

        public async Task<bool> ResetPasswordAsync(string email, string otp, string newPassword)
        {
            if (!await VerifyOtpAsync(email, otp)) return false;

            var account = await _accountRepository.FirstOrDefaultAsync(a => a.Customers.Any(c => c.Email == email) || a.SkinTherapists.Any(st => st.Email == email));
            if (account == null) return false;

            account.Password = newPassword;
            await _accountRepository.UpdateAsync(account);
            await _accountRepository.SaveChangesAsync();

            OtpStore.TryRemove(email, out _);

            return true;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            await _emailService.SendEmailAsync(to, subject, body);
        }

        public Task<bool> VerifyOtpAsync(string email, string otp)
        {
            if (OtpStore.TryGetValue(email, out var storedOtp) && storedOtp.Otp == otp && storedOtp.Expires > DateTime.UtcNow)
            {
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        private string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}
