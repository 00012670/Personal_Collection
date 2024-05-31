using System.ComponentModel.DataAnnotations;

public class UserRole
{
    [Required]
    public string? Role { get; set; }
}