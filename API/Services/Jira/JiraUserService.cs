
using System.Text;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

public class JiraUserService : JiraServiceBase
{
    public JiraUserService(HttpClient httpClient, IOptions<JiraSettings> jiraSettings, ILogger<JiraUserService> logger)
        : base(httpClient, jiraSettings, logger)
    {
    }
    public async Task<User> EnsureUserExists(string email, string username, string password, string displayName, List<string> applicationRoles)
    {
        var user = await GetUserByEmail(email);
        if (user == null)
        {
            user = await CreateUserInJira(email, username, password, displayName, applicationRoles);
        }
        return user;
    }

    public async Task<User> GetUserByEmail(string email)
    {
        if (await UserExistsInJira(email))
        {
            var response = await SendRequestAndHandleResponse(HttpMethod.Get, $"{_jiraSettings.BaseUrl}/rest/api/2/user/search?query={email}");
            var users = JsonConvert.DeserializeObject<List<User>>(response);
            return users.FirstOrDefault();
        }
        return null;
    }
    public async Task<bool> UserExistsInJira(string email)
    {
        var response = await SendRequestAndHandleResponse(HttpMethod.Get, $"{_jiraSettings.BaseUrl}/rest/api/2/user/search?query={email}");
        var users = JsonConvert.DeserializeObject<List<dynamic>>(response);
        return users.Any();
    }

    public async Task<User> CreateUserInJira(string email, string username, string password, string displayName, List<string> applicationRoles)
    {
        ValidateApplicationRoles(applicationRoles);
        var user = CreateUserObject(username, password, email, displayName, applicationRoles);
        var response = await SendUserCreationRequest(user);
        return JsonConvert.DeserializeObject<User>(response);
    }

    private async void ValidateApplicationRoles(List<string> applicationRoles)
    {
        var validApplicationRoles = await GetApplicationRolesAsync();
        foreach (var role in applicationRoles)
        {
            if (!validApplicationRoles.Contains(role))
            {
                throw new ArgumentException($"Invalid application role: {role}");
            }
        }
    }

    private async Task<string> SendUserCreationRequest(dynamic user)
    {
        var json = JsonConvert.SerializeObject(user);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        return await SendRequestAndHandleResponse(HttpMethod.Post, $"{_jiraSettings.BaseUrl}/rest/api/2/user", content);
    }

    private dynamic CreateUserObject(string username, string password, string email, string displayName, List<string> applicationRoles)
    {
        return new
        {
            name = username,
            password,
            emailAddress = email,
            displayName,
            products = applicationRoles
        };
    }

    public class User
    {
        public string Self { get; set; }
        public string AccountId { get; set; }
        public string AccountType { get; set; }
        public string EmailAddress { get; set; }
        public Dictionary<string, string> AvatarUrls { get; set; }
        public string DisplayName { get; set; }
        public bool Active { get; set; }
        public string Locale { get; set; }
    }



    public async Task<List<User>> GetAllUsers()
    {
        var response = await SendRequestAndHandleResponse(HttpMethod.Get, $"{_jiraSettings.BaseUrl}/rest/api/2/users");
        return JsonConvert.DeserializeObject<List<User>>(response);
    }

}