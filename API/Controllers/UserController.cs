using System.ComponentModel.DataAnnotations;
using API.Context;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class UserController : Controller
{
    private readonly DBContext _context;
    private readonly UserService _userService;

    public UserController(DBContext context, UserService userService)
    {
        _context = context;
        _userService = userService;
    }

    [HttpDelete("delete-users")]
    public async Task<IActionResult> DeleteUsers([FromBody] List<int> userIds)
    {
        foreach (var id in userIds)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
        }
        await _context.SaveChangesAsync();
        return NoContent();
    }

    public class UpdateUserStatusModel
    {
        [Required]
        public string? Status { get; set; }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> SetAccountStatus(int id, [FromBody] UpdateUserStatusModel model)
    {
        if (!Enum.TryParse<Status>(model.Status, true, out var status))
        {
            return BadRequest("Invalid status value");
        }
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        user.Status = status;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    public class UpdateUseRoleModel
    {
        [Required]
        public string? Role { get; set; }
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> SetUserRole(int id, [FromBody] UpdateUseRoleModel model)
    {
        if (!Enum.TryParse<Role>(model.Role, true, out var role))
        {
            return BadRequest("Invalid role value");
        }
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        user.Role = role;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }
}
