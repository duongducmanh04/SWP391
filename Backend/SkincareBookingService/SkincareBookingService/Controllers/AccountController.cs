using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs.AccountDTOs;
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

        [HttpPost("createAccount")]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDTO account)
        {
            var newAccount = await _accountService.CreateAccountAsync(account);
            if (newAccount == null)
            {
                return BadRequest("Failed to create account");
            }
            return Ok(newAccount);
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

        [HttpPut("updateAccount/{accountId}")]
        public async Task<IActionResult> UpdateAccount(int accountId, [FromBody] AccountDTO account)
        {
            var result = await _accountService.UpdateAccountAsync(accountId, account);
            if (result)
            {
                return Ok("Account updated successfully");
            }
            return BadRequest("Failed to update account");
        }

        [HttpPut("updateAccountPassword/{accountId}")]
        public async Task<IActionResult> UpdateAccountPassword(int accountId, [FromBody] string password)
        {
            var result = await _accountService.UpdateAccountPasswordAsync(accountId, password);
            if (result)
            {
                return Ok("Password updated successfully");
            }
            return BadRequest("Failed to update password");
        }

        [HttpDelete("deleteAccount/{accountId}")]
        public async Task<IActionResult> DeleteAccount(int accountId)
        {
            var result = await _accountService.DeleteAccountAsync(accountId);
            if (result)
            {
                return Ok("Account deleted successfully");
            }
            return BadRequest("Failed to delete account");
        }
    }
}
