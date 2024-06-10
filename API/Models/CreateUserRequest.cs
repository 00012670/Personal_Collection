public class CreateUserRequest
{
    public string Email { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string DisplayName { get; set; }
    public List<string> ApplicationRoles { get; set; }
}
