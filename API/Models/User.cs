using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string PasswordHash { get; set; } = string.Empty;

        public Status Status { get; set; } = Status.Active;

        public Role Role { get; set; } = Role.User;
    }

    public enum Status
    {
        Active,
        Blocked
    }

    public enum Role
    {
        User,
        Admin
    }
}