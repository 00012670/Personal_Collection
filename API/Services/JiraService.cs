using System.Net.Http.Headers;
using System.Text;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

public class JiraService
{
    private readonly HttpClient _httpClient;
    private readonly JiraSettings _jiraSettings;
    private readonly ILogger<JiraService> _logger;


    public JiraService(HttpClient httpClient, IOptions<JiraSettings> jiraSettings, ILogger<JiraService> logger)
    {
        _httpClient = httpClient;
        _jiraSettings = jiraSettings.Value;
        _logger = logger;
    }

    // public async Task<string> CreateJiraTicket(string summary, string reported, string collection, Uri link, string priority)
    // {
    //     try
    //     {
    //         _logger.LogInformation("Creating Jira ticket...");
    //         var issue = CreateIssueObject(summary, reported, collection, link, priority);
    //         var content = PrepareRequestContent(issue);
    //         SetAuthorizationHeader();
    //         return await SendRequestAndHandleResponse(content);
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, "Error creating Jira ticket");
    //         throw;
    //     }
    // }

    private dynamic CreateIssueObject(string summary, string email, string collection, Uri link, string priority)
    {
        return new
        {
            fields = new
            {
                project = new { key = "KAN" },
                summary = summary,
                issuetype = new { name = "Task" },
                customfield_10042 = email,
                customfield_10032 = collection,
                customfield_10037 = link,
                customfield_10036 = priority,
            }
        };
    }


    public async Task<string> CreateIssue(string summary, string email, string collection, Uri link, string priority)
    {
        // Check if user exists in Jira
        var userExists = await UserExistsInJira(email);

        // If user does not exist, create the user
        if (!userExists)
        {
            // You need to provide the username, password, displayName, and applicationRoles
            // for the CreateUserInJira method. Modify as needed.
            await CreateUserInJira(email, "username", "password", "displayName", new List<string> { "applicationRole1", "applicationRole2" });
        }

        var issue = CreateIssueObject(summary, email, collection, link, priority);
        var content = PrepareRequestContent(issue);
        SetAuthorizationHeader();
        var issueKey = await SendRequestAndHandleResponse(content);
        return issueKey;
    }
    public async Task<bool> UserExistsInJira(string email)
    {
        SetAuthorizationHeader();

        var response = await _httpClient.GetAsync($"{_jiraSettings.BaseUrl}/rest/api/2/user/search?query={email}");
        if (response.IsSuccessStatusCode)
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<List<dynamic>>(responseBody);
            return users.Any();
        }
        else
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            _logger.LogError($"Failed to search for user. Response status code: {response.StatusCode}. Response body: {responseBody}");
            throw new HttpRequestException($"Failed to search for user. Response status code: {response.StatusCode}. Response body: {responseBody}");
        }
    }


    private StringContent PrepareRequestContent(dynamic issue)
    {
        var json = JsonConvert.SerializeObject(issue);
        _logger.LogInformation($"Request payload: {json}");
        return new StringContent(json, Encoding.UTF8, "application/json");
    }

    private void SetAuthorizationHeader()
    {
        var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_jiraSettings.Username}:{_jiraSettings.ApiToken}"));
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
    }

    public async Task<List<string>> GetApplicationRolesAsync()
    {
        SetAuthorizationHeader();

        var response = await _httpClient.GetAsync($"{_jiraSettings.BaseUrl}/rest/api/2/applicationrole");
        if (!response.IsSuccessStatusCode)
        {
            var responseBodyj = await response.Content.ReadAsStringAsync();
            _logger.LogError($"Failed to retrieve application roles. Response status code: {response.StatusCode}. Response body: {responseBodyj}");
            throw new HttpRequestException($"Failed to retrieve application roles. Response status code: {response.StatusCode}. Response body: {responseBodyj}");
        }

        var responseBody = await response.Content.ReadAsStringAsync();
        var roles = JsonConvert.DeserializeObject<List<ApplicationRole>>(responseBody);

        var applicationKeys = new List<string>();
        foreach (var role in roles)
        {
            applicationKeys.Add(role.Key);
        }

        return applicationKeys;
    }



    // private void SetAuthorizationHeader()
    // {
    //     var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_jiraSettings.Username}:{_jiraSettings.ApiToken}"));
    //     _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
    // }

    private async Task<string> SendRequestAndHandleResponse(StringContent content)
    {
        var response = await _httpClient.PostAsync($"{_jiraSettings.BaseUrl}/rest/api/2/issue", content);
        if (!response.IsSuccessStatusCode)
        {
            var responseBodies = await response.Content.ReadAsStringAsync();
            _logger.LogError($"Response status code does not indicate success: {response.StatusCode}. Response body: {responseBodies}");
            throw new HttpRequestException($"Response status code does not indicate success: {response.StatusCode}. Response body: {responseBodies}");
        }
        var responseBody = await response.Content.ReadAsStringAsync();
        var responseJson = JsonConvert.DeserializeObject<dynamic>(responseBody);
        return responseJson.key;
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

        var user = new
        {
            name = username,
            password = password,
            emailAddress = email,
            displayName = displayName,
            products = applicationRoles
        };

        var json = JsonConvert.SerializeObject(user);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        SetAuthorizationHeader();

        var response = await _httpClient.PostAsync($"{_jiraSettings.BaseUrl}/rest/api/2/user", content);
        if (!response.IsSuccessStatusCode)
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            _logger.LogError($"Failed to create user. Response status code: {response.StatusCode}. Response body: {responseBody}");
            throw new HttpRequestException($"Failed to create user. Response status code: {response.StatusCode}. Response body: {responseBody}");
        }
        return email;
    }



    // public async Task<List<JiraTicket>> GetUserTickets(string userEmail)
    // {
    //     var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_jiraSettings.Username}:{_jiraSettings.ApiToken}"));
    //     _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);

    //     var response = await _httpClient.GetAsync($"{_jiraSettings.BaseUrl}/rest/api/2/search?jql=reporter={userEmail}");
    //     response.EnsureSuccessStatusCode();

    //     var responseBody = await response.Content.ReadAsStringAsync();
    //     var responseJson = JsonConvert.DeserializeObject<dynamic>(responseBody);

    //     var tickets = new List<JiraTicket>();
    //     foreach (var issue in responseJson.issues)
    //     {
    //         tickets.Add(new JiraTicket
    //         {
    //             Id = issue.id,
    //             Key = issue.key,
    //             Summary = issue.fields.summary,
    //             Status = issue.fields.status.name,
    //             Priority = issue.fields.priority.name
    //         });
    //     }

    //     return tickets;
    // }
}

