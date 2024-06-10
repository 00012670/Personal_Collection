using Microsoft.Extensions.Options;

public class JiraService : JiraServiceBase
{
    public JiraService(HttpClient httpClient, IOptions<JiraSettings> jiraSettings, ILogger<JiraServiceBase> logger)
        : base(httpClient, jiraSettings, logger)
    {
    }

}