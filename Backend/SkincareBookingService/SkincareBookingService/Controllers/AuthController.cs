using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs.AuthenticationDTOs;
using SkincareBookingService.BLL.DTOs.EmailDTOs;
using SkincareBookingService.BLL.Interfaces;
using System.Security.Claims;

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
            if (string.IsNullOrEmpty(registerDTO.AccountName) || string.IsNullOrEmpty(registerDTO.Email) || string.IsNullOrEmpty(registerDTO.Password))
            {
                return BadRequest(new { message = "Please enter account, email and password!" });
            }

            var canRegister = await _authService.CanRegisterCustomerAsync(registerDTO.AccountName, registerDTO.Email);

            if (!canRegister)
            {
                return BadRequest(new { message = "Account name or email already exists!" });
            }

            var account = await _authService.RegisterAsync(registerDTO.AccountName, registerDTO.Email, registerDTO.Password);
            if (account == null)
            {
                return BadRequest(new { message = "Failed to register account!" });
            }
            return Ok(new { message = "Account registered successfully!" });
        }


        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDTO)
        {
            if (string.IsNullOrEmpty(forgotPasswordDTO.Email))
            {
                return BadRequest(new { message = "Please enter email!" });
            }
            var result = await _authService.ForgotPasswordAsync(forgotPasswordDTO.Email);
            if (result)
            {
                return Ok(new { message = "OTP has been sent to your email!" });
            }
            return BadRequest(new { message = "Email not found!" });
        }

        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            if (string.IsNullOrEmpty(resetPasswordDTO.Email) || string.IsNullOrEmpty(resetPasswordDTO.Otp) || string.IsNullOrEmpty(resetPasswordDTO.NewPassword))
            {
                return BadRequest(new { message = "Please enter email, OTP and new password!" });
            }
            var result = await _authService.ResetPasswordAsync(resetPasswordDTO.Email, resetPasswordDTO.Otp, resetPasswordDTO.NewPassword);
            if (result)
            {
                return Ok(new { message = "Password reset successfully!" });
            }
            return BadRequest(new { message = "Failed to reset password!" });
        }

        [HttpPost("verifyOtp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDTO verifyOtpDTO)
        {
            if (string.IsNullOrEmpty(verifyOtpDTO.Email) || string.IsNullOrEmpty(verifyOtpDTO.Otp))
            {
                return BadRequest(new { message = "Please enter email and OTP!" });
            }
            var result = await _authService.VerifyOtpAsync(verifyOtpDTO.Email, verifyOtpDTO.Otp);
            if (result)
            {
                return Ok(new { message = "OTP is correct!" });
            }
            return BadRequest(new { message = "OTP is incorrect or expired!" });
        }

        // GET: api/auth/getGoogleUser
        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties
            {
                // Specify full redirect URL
                RedirectUri = $"{Request.Scheme}://{Request.Host}/api/auth/google-callback",
                Items =
        {
            { "scheme", GoogleDefaults.AuthenticationScheme },
            // Add additional debugging information
            { "debugInfo", "Swagger OAuth Test" }
        }
            };

            Console.WriteLine($"Initiating Google OAuth login. Redirect URI: {properties.RedirectUri}");

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }


        // GET: api/auth/google-callback
        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            try
            {
                // Log all incoming request details
                Console.WriteLine($"Callback Request Headers: {string.Join(", ", Request.Headers)}");
                Console.WriteLine($"Callback Request Query Params: {string.Join(", ", Request.Query)}");

                // Try multiple authentication schemes
                var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

                if (!authenticateResult.Succeeded)
                {
                    // More detailed failure logging
                    Console.WriteLine("Authentication Failed");
                    Console.WriteLine($"Failure Reason: {authenticateResult.Failure?.Message}");
                    Console.WriteLine($"Failure Details: {authenticateResult.Failure?.ToString()}");

                    return BadRequest(new
                    {
                        message = "Google authentication failed",
                        reason = authenticateResult.Failure?.Message,
                        details = authenticateResult.Failure?.ToString()
                    });
                }

                var principal = authenticateResult.Principal;
                if (principal == null)
                {
                    Console.WriteLine("Authentication Principal is null");
                    return BadRequest(new { message = "No authentication principal found" });
                }

                var email = principal.FindFirst(ClaimTypes.Email)?.Value;
                Console.WriteLine($"Retrieved Email: {email}");

                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new { message = "Unable to retrieve email from Google" });
                }

                var account = await _authService.GetGoogleUserAsync(email);
                if (account == null)
                {
                    return BadRequest(new { message = "Account does not exist" });
                }

                var (token, expiration) = _jwtService.GenerateToken(account);
                return Ok(new GoogleLoginResponseDTO
                {
                    Token = token,
                    AccountId = account.AccountId.ToString(),
                    Role = account.Role,
                    Email = email,
                    TokenExpiration = expiration.ToString("yyyy-MM-ddTHH:mm:ssZ")
                });
            }
            catch (Exception ex)
            {
                // Catch-all error logging
                Console.WriteLine($"Unexpected Error in GoogleCallback: {ex.Message}");
                Console.WriteLine($"Full Exception: {ex}");

                return StatusCode(500, new
                {
                    message = "An unexpected error occurred during Google authentication",
                    error = ex.Message
                });
            }
        }
    }
}
