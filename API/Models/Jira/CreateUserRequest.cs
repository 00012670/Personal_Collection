public class CreateUserRequest
{
    public int AccountId { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string DisplayName { get; set; }
    public List<string> ApplicationRoles { get; set; }
}
