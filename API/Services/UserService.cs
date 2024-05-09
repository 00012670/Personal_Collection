using API.Context;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class UserService
    {
        private readonly DBContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(DBContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<bool> CheckIfUserExists(string username, string email)
        {
            var existingUser = await FindByUsernameOrEmail(username, email);
            return existingUser != null;
        }

        public async Task<User?> FindByUsernameOrEmail(string username, string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u =>
                u.Username == username || u.Email == email
            );
        }

        public async Task<User?> CreateUser(string username, string email, string password)
        {
            // Create a new user
            var user = new User
            {
                Username = username,
                Email = email,
                Status = Status.Active,
                Role = Role.User
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }
    }
}
