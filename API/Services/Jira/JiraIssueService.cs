
using System.Text;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

public class JiraIssueService : JiraServiceBase
{
    private readonly JiraUserService _jiraUserService;

    public JiraIssueService(HttpClient httpClient, IOptions<JiraSettings> jiraSettings, ILogger<JiraIssueService> logger, JiraUserService jiraUserService)
        : base(httpClient, jiraSettings, logger)
    {
        _jiraUserService = jiraUserService;
    }

    public async Task<string> CreateIssue(string summary, string email, string collection, Uri link, string priority)
    {
        await _jiraUserService.EnsureUserExists(email);
        var issue = CreateIssueObject(summary, email, collection, link, priority);
        var content = PrepareRequestContent(issue);
        return await SendRequestAndHandleResponse(HttpMethod.Post, $"{_jiraSettings.BaseUrl}/rest/api/2/issue", content);
    }

    private dynamic CreateIssueObject(string summary, string email, string collection, Uri link, string priority)
    {
        return new
        {
            fields = new
            {
                project = new { key = "KAN" },
                summary,
                issuetype = new { name = "Task" },
                customfield_10042 = email,
                customfield_10032 = collection,
                customfield_10037 = link,
                customfield_10036 = priority,
            }
        };
    }

    private StringContent PrepareRequestContent(dynamic issue)
    {
        var json = JsonConvert.SerializeObject(issue);
        _logger.LogInformation($"Request payload: {json}");
        return new StringContent(json, Encoding.UTF8, "application/json");
    }
}