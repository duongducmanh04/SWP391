using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.DTOs.AccountDTOs;
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
        private readonly IAccountService _accountService;
        private readonly IGenericRepository<Customer> _customerRepository;

        private static readonly ConcurrentDictionary<string, (string Otp, DateTime Expires)> OtpStore = new();

        public AuthService(IGenericRepository<Account> accountRepository, IEmailService emailService,
            IAccountService accountService, IGenericRepository<Customer> customerRepository )
        {
            _accountRepository = accountRepository;
            _emailService = emailService;
            _accountService = accountService;
            _customerRepository = customerRepository;
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

        public async Task<AccountDTO> RegisterAsync(string accountName, string email, string password)
        {
            var account = new Account
            {
                AccountName = accountName,
                Password = password,
                Role = "Customer",
                Active = true
            };

            var customer = new Customer
            {
                Name = accountName,
                Email = email,
                SkintypeId = null,
                AccountId = account.AccountId,
                PhoneNumber = null,
                Image = null
            };

            account.Customers = new List<Customer> { customer };

            await _accountRepository.AddAsync(account);
            await _accountRepository.SaveChangesAsync();

            return new AccountDTO
            {
                AccountId = account.AccountId,
                AccountName = account.AccountName,
                Password = account.Password,
                Role = account.Role,
                Active = account.Active,
                Customer = new List<CustomerDTO>
                {
                    new CustomerDTO
                    {
                        Name = customer.Name,
                        Email = customer.Email,
                        SkintypeId = customer.SkintypeId,
                        AccountId = customer.AccountId,
                        PhoneNumber = customer.PhoneNumber,
                        Image = customer.Image
                    }
                }
            };
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

        public async Task<bool> CanRegisterCustomerAsync(string accountName, string email)
        {
            var accountExists = await _accountRepository.FirstOrDefaultAsync(a => a.AccountName == accountName) != null;
            var emailExists = await _customerRepository.FirstOrDefaultAsync(c => c.Email == email) != null;

            return !accountExists && !emailExists;
        }
    }
}
