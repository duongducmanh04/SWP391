using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet("getAllAccounts")]
        public async Task<IActionResult> GetAllAccounts()
        {
            var accounts = await _accountService.GetAllAccountAsync();
            if (accounts == null || accounts.Count == 0)
            {
                return NotFound("No accounts found");
            }
            return Ok(accounts);
        }

        [HttpGet("getAccountById/{accountId}")]
        public async Task<IActionResult> GetAccountById(int accountId)
        {
            var account = await _accountService.GetAccountByIdAsync(accountId);
            if (accountId <= 0)
            {
                return NotFound("AccountId should be >0");
            } 
            else if (account == null)
            {
                return NotFound("No account found with that id");
            }
            return Ok(account);
        }

        [HttpGet("getAccountByRole/{role}")]
        public async Task<IActionResult> GetAccountByRole(string role)
        {
            var accounts = await _accountService.GetAccountByRoleAsync(role);
            if (accounts == null || accounts.Count == 0)
            {
                return NotFound("No accounts found with that role");
            }
            return Ok(accounts);
        }

        [HttpGet("getAccountByIdAndRole/{accountId}/{role}")]
        public async Task<IActionResult> GetAccountByIdAndRole(int accountId, string role)
        {
            var accounts = await _accountService.GetAccountByIdAndRoleAsync(accountId, role);
            if (accountId <= 0)
            {
                return NotFound("AccountId should be >0");
            }
            else if (accounts == null || accounts.Count == 0)
            {
                return NotFound("No accounts found with that id and role");
            }
            return Ok(accounts);
        }
    }
}
