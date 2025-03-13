using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.DTOs.AccountDTOs;
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

        public async Task<CreateAccountDTO> CreateAccountAsync(CreateAccountDTO account)
        {
            var newAccount = new CreateAccountDTO
            {
                AccountName = account.AccountName,
                Password = account.Password,
                Role = account.Role,
                Active = true
            };

            await _accountRepository.AddAsync(new Account
            {
                AccountName = newAccount.AccountName,
                Password = newAccount.Password,
                Role = newAccount.Role,
                Active = newAccount.Active
            });

            await _accountRepository.SaveChangesAsync();
            return newAccount;

        }

        public async Task<bool> DeleteAccountAsync(int accountId)
        {
            var account = await _accountRepository.FirstOrDefaultAsync(a => a.AccountId == accountId);
            if (account == null)
            {
                return false;
            }

            await _accountRepository.DeleteAsync(account);
            await _accountRepository.SaveChangesAsync();
            return true;
        }

        public async Task<List<AccountDTO>> GetAccountByIdAndRoleAsync(int accountId, string role)
        {

            role = char.ToUpper(role[0]) + role.Substring(1).ToLower();

            var accounts = await _accountRepository
                .FindAsync(a => a.AccountId == accountId && a.Role == role, include: "Customers,SkinTherapists");

            return accounts.Select(a => new AccountDTO
            {
                AccountId = a.AccountId,
                AccountName = a.AccountName,
                Role = a.Role,
                Active = a.Active,
                Customer = a.Role == "Customer" ? a.Customers?.Select(c => new CustomerDTO
                {
                    CustomerId = c.CustomerId,
                    Name = c.Name,
                    SkintypeId = c.SkintypeId,
                    PhoneNumber = c.PhoneNumber,
                    Image = c.Image,
                    Email = c.Email
                }).ToList() : null,

                SkinTherapists = a.Role == "Skintherapist" ? a.SkinTherapists?.Select(st => new SkinTherapistDTO
                {
                    SkintherapistId = st.SkintherapistId,
                    Name = st.Name,
                    Speciality = st.Speciality,
                    Email = st.Email,
                    Experience = st.Experience,
                    Image = st.Image,
                    Degree = st.Degree
                }).ToList() : null
            }).ToList();
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

        public async Task<bool> UpdateAccountAsync(AccountDTO accountDto)
        {
            var account = await _accountRepository.FirstOrDefaultAsync(a => a.AccountId == accountDto.AccountId);
            if (account == null)
            {
                return false;
            }

            account.AccountName = accountDto.AccountName;
            account.Password = accountDto.Password;
            account.Role = accountDto.Role;
            account.Active = true;

            await _accountRepository.UpdateAsync(account);
            await _accountRepository.SaveChangesAsync();

            return true;
        }


        public async Task<bool> UpdateAccountPasswordAsync(int accountId, string password)
        {
            var account = await _accountRepository.FirstOrDefaultAsync(a => a.AccountId == accountId);

            if (account == null)
            {
                return false;
            }

            account.Password = password;
            await _accountRepository.UpdateAsync(account);
            await _accountRepository.SaveChangesAsync();

            return true;
        }
    }
}
