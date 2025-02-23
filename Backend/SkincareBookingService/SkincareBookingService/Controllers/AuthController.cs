using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IJwtService _jwtService;

        public AuthController(IAuthService authService, IJwtService jwtService)
        {
            _authService = authService;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (string.IsNullOrEmpty(loginDTO.AccountName) || string.IsNullOrEmpty(loginDTO.Password))
            {
                return BadRequest(new { message = "Please enter account and password!" });
            }

            var account = await _authService.AuthenticateAsync(loginDTO.AccountName, loginDTO.Password);

            if (account == null)
            {
                return Unauthorized(new { message = "Incorrect account name or password!" });
            }

            // ✅ Tạo JWT Token
            var token = _jwtService.GenerateToken(account);

            return Ok(new
            {
                message = "Login Successfully!",
                accountId = account.AccountId,
                role = account.Role,
                token = token  // ✅ Trả về Token để sử dụng trong Swagger & API khác
            });
        }
    }
}
