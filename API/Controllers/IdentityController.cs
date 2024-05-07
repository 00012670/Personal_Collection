using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Context;
using API.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Services;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IdentityController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly API.Services.AuthenticationService _authService;
        private readonly ValidationService _validationService;
    
        public IdentityController(UserService userService, API.Services.AuthenticationService authService, ValidationService validationService)
        {
            _userService = userService;
            _authService = authService;
            _validationService = validationService;
        }
    
        [HttpPost("register")]
        public async Task<IActionResult> Register(string username, string email, string password)
        {
            var validationResult = _validationService.ValidateRegistrationData(username, email, password);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.ErrorMessage);
            }    
            var existingUser = await _userService.FindByUsernameOrEmail(username, email);
            if (existingUser != null)
            {
                return BadRequest("Username or email already exists.");
            }   
            var user = await _userService.CreateUser(username, email, password);
            return Ok("User registered successfully.");
        }
    
        [HttpPost("login")]
        public async Task<IActionResult> Login(string identifier, string password)
        {
            var validationResult = _validationService.ValidateLoginData(identifier, password);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.ErrorMessage);
            }   
            var user = await _userService.FindByUsernameOrEmail(identifier, identifier);
            if (user == null || !_authService.VerifyPassword(user, password))
            {
                return Unauthorized("Invalid username or password.");
            }
            await _authService.SignIn(user);
            return Ok();
        }
    }
}