using System.Net.Http.Headers;
using System.Text;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

public abstract class JiraServiceBase
{
    protected readonly HttpClient _httpClient;
    protected readonly JiraSettings _jiraSettings;
    protected readonly ILogger<JiraServiceBase> _logger;

    public JiraServiceBase(HttpClient httpClient, IOptions<JiraSettings> jiraSettings, ILogger<JiraServiceBase> logger)
    {
        _httpClient = httpClient;
        _jiraSettings = jiraSettings.Value;
        _logger = logger;
        SetAuthorizationHeader();
    }

    private void SetAuthorizationHeader()
    {
        var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_jiraSettings.Username}:{_jiraSettings.ApiToken}"));
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
    }

    protected async Task<string> SendRequestAndHandleResponse(HttpMethod method, string url, StringContent content = null)
    {
        var request = new HttpRequestMessage(method, url) { Content = content };
        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
    
    public async Task<List<string>> GetApplicationRolesAsync()
    {
        var response = await SendRequestAndHandleResponse(HttpMethod.Get, $"{_jiraSettings.BaseUrl}/rest/api/2/applicationrole");
        var roles = JsonConvert.DeserializeObject<List<ApplicationRole>>(response);
        return roles.Select(role => role.Key).ToList();
    }
}
