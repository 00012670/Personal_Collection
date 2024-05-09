using Microsoft.AspNetCore.Mvc;
using API.Services;

namespace API.Controllers
{
    public class RegistrationData
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    public class IdentityController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly AuthenticationService _authService;
        private readonly ValidationService _validationService;

        public IdentityController(UserService userService, AuthenticationService authService, ValidationService validationService, ILogger<IdentityController> logger)
        {
            _userService = userService;
            _authService = authService;
            _validationService = validationService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationData data)
        {
            if (data == null || data.Username == null || data.Email == null || data.Password == null)
            {
                return BadRequest(new { Message = "Invalid registration data." });
            }
        
            var validationResult = _validationService.ValidateRegistrationData(data.Username, data.Email, data.Password);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult.ErrorMessage });
            }
        
            var isUserExists = await _userService.CheckIfUserExists(data.Username, data.Email);
            if (isUserExists)
            {
                return BadRequest(new { Message = "Username or email already exists." });
            }
        
            await _userService.CreateUser(data.Username, data.Email, data.Password);
            return Ok(new { Message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string identifier, string password)
        {
            var validationResult = _validationService.ValidateLoginData(identifier, password);
            if (!validationResult.IsValid)
            {
                return BadRequest(new { Message = validationResult.ErrorMessage });
            }
            var user = await _userService.FindByUsernameOrEmail(identifier, identifier);
            if (user == null || !_authService.VerifyPassword(user, password))
            {
                return Unauthorized(new { Message = "Invalid username or password." });
            }
            var token = _authService.GenerateJwtToken(user);
            return Ok(new { Token = token });
        }
    }
}