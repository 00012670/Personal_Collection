
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

[ApiController]
[Route("[controller]")]
public class JiraController : ControllerBase
{

    private readonly JiraServiceBase _jiraServiceBase;
    private readonly JiraIssueService _jiraService;
    private readonly JiraUserService _jiraUserService;
    private readonly JiraIssueService _jiraIssueService;
    private readonly IOptions<JiraSettings> _jiraSettings;

    public JiraController(IOptions<JiraSettings> jiraSettings, JiraServiceBase jiraServiceBase, JiraIssueService jiraService, JiraUserService jiraUserService, JiraIssueService jiraIssueService)
    {
        _jiraServiceBase = jiraServiceBase;
        _jiraService = jiraService;
        _jiraUserService = jiraUserService;
        _jiraSettings = jiraSettings;
        _jiraIssueService = jiraIssueService;

    }

    [HttpGet("check-user")]
    public async Task<IActionResult> CheckUser(string email)
    {
        try
        {
            var userExists = await _jiraUserService.UserExistsInJira(email);
            return Ok(new { userExists });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("get-issues-by-reporter-email/{email}")]
    public async Task<IActionResult> GetIssuesByReporterEmail(string email)
    {
        try
        {
            var issues = await _jiraService.GetIssuesByReporterEmail(email);
            return Ok(issues);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("create-jira-ticket")]
    public async Task<IActionResult> CreateJiraTicket ([FromBody] IssueRequest request)
    {
        try
        {
            var result = await _jiraIssueService.CreateJiraTicket(
                request.Email,
                request.Username,
                request.Password,
                request.DisplayName,
                request.ApplicationRoles,
                request.IssueSummary,
                request.Collection,
                request.Link,
                request.Priority
            );
            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}