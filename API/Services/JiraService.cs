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
    public async Task<string> CreateJiraTicket(string summary, string priority, Uri link)
    {
        try
        {
            _logger.LogInformation("Creating Jira ticket...");

            var issue = new
            {
                fields = new
                {
                    project = new { key = "KAN" },
                    summary = summary,
                    issuetype = new { name = "Task" },
                    customfield_10036 = priority,
                    customfield_10037 = link,
                    
                }
            };

            var json = JsonConvert.SerializeObject(issue);
            _logger.LogInformation($"Request payload: {json}");

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_jiraSettings.Username}:{_jiraSettings.ApiToken}"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);

            var response = await _httpClient.PostAsync($"{_jiraSettings.BaseUrl}/rest/api/2/issue", content);
            if (!response.IsSuccessStatusCode)
            {
                var responseBodyc = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Response status code does not indicate success: {response.StatusCode}. Response body: {responseBodyc}");
                throw new HttpRequestException($"Response status code does not indicate success: {response.StatusCode}. Response body: {responseBodyc}");
            }

            var responseBody = await response.Content.ReadAsStringAsync();
            var responseJson = JsonConvert.DeserializeObject<dynamic>(responseBody);

            return responseJson.key;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Jira ticket");
            throw; // Rethrow the exception to propagate it to the caller
        }
    }
    public async Task CreateUserInJira(string email, string displayName)
    {
        var user = new
        {
            emailAddress = email,
            displayName = displayName
        };

        var json = JsonConvert.SerializeObject(user);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_jiraSettings.Username}:{_jiraSettings.ApiToken}"));
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);

        var response = await _httpClient.PostAsync($"{_jiraSettings.BaseUrl}/rest/api/2/user", content);
        response.EnsureSuccessStatusCode();
    }

    public async Task<List<JiraTicket>> GetUserTickets(string userEmail)
    {
        var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_jiraSettings.Username}:{_jiraSettings.ApiToken}"));
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);

        var response = await _httpClient.GetAsync($"{_jiraSettings.BaseUrl}/rest/api/2/search?jql=reporter={userEmail}");
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();
        var responseJson = JsonConvert.DeserializeObject<dynamic>(responseBody);

        var tickets = new List<JiraTicket>();
        foreach (var issue in responseJson.issues)
        {
            tickets.Add(new JiraTicket
            {
                Id = issue.id,
                Key = issue.key,
                Summary = issue.fields.summary,
                Status = issue.fields.status.name,
                Priority = issue.fields.priority.name
            });
        }

        return tickets;
    }
}

