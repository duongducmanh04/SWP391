using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs.AuthenticationDTOs;
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

            // Generate JWT Token
            var (token, expiration) = _jwtService.GenerateToken(account);

            return Ok(new
            {
                message = "Login Successfully!",
                accountId = account.AccountId,
                role = account.Role,
                token = token,
                tokenExpiration = expiration.ToString("yyyy-MM-ddTHH:mm:ssZ") // Hiển thị thời gian hết hạn
            });

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            if (string.IsNullOrEmpty(registerDTO.AccountName) || string.IsNullOrEmpty(registerDTO.Password))
            {
                return BadRequest(new { message = "Please enter account and password!" });
            }
            var account = await _authService.RegisterAsync(registerDTO.AccountName, registerDTO.Password);
            return Ok(new
            {
                message = "Register Successfully!",
                accountId = account.AccountId,
                role = account.Role
            });
        }
    }
}
