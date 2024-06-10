
using System.Text;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

public class JiraUserService : JiraServiceBase
{
    public JiraUserService(HttpClient httpClient, IOptions<JiraSettings> jiraSettings, ILogger<JiraUserService> logger)
        : base(httpClient, jiraSettings, logger)
    {
    }

    public async Task EnsureUserExists(string email)
    {
        if (!await UserExistsInJira(email))
        {
            await CreateUserInJira(email, "username", "password", "displayName", new List<string> { "applicationRole1", "applicationRole2" });
        }
    }

    public async Task<bool> UserExistsInJira(string email)
    {
        var response = await SendRequestAndHandleResponse(HttpMethod.Get, $"{_jiraSettings.BaseUrl}/rest/api/2/user/search?query={email}");
        var users = JsonConvert.DeserializeObject<List<dynamic>>(response);
        return users.Any();
    }

    public async Task<string> CreateUserInJira(string email, string username, string password, string displayName, List<string> applicationRoles)
    {
        var validApplicationRoles = await GetApplicationRolesAsync();

        foreach (var role in applicationRoles)
        {
            if (!validApplicationRoles.Contains(role))
            {
                throw new ArgumentException($"Invalid application role: {role}");
            }
        }
        var user = CreateUserObject(username, password, email, displayName, applicationRoles);
        var json = JsonConvert.SerializeObject(user);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await SendRequestAndHandleResponse(HttpMethod.Post, $"{_jiraSettings.BaseUrl}/rest/api/2/user", content);
        return user.emailAddress;
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
}