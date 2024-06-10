
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class JiraController : ControllerBase
{

    private readonly JiraServiceBase _jiraServiceBase;
    private readonly JiraIssueService _jiraService;
    private readonly JiraUserService _jiraUserService;
    public JiraController(JiraServiceBase jiraServiceBase, JiraIssueService jiraService, JiraUserService jiraUserService)
    {
        _jiraServiceBase = jiraServiceBase;
        _jiraService = jiraService;
        _jiraUserService = jiraUserService;
    }


    [HttpPost("create-jira-ticket")]
    public async Task<IActionResult> CreateJiraTicket([FromBody] JiraTicketRequest request)
    {
        var ticketKey = await _jiraService.CreateIssue(request.Summary, request.Reported, request.Collection, request.Link, request.Priority);
        return Ok(new { key = ticketKey });
    }


    [HttpPost("create-user")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            await _jiraUserService.CreateUserInJira(request.Email, request.Username, request.Password, request.DisplayName, request.ApplicationRoles);
            return Ok("User created successfully");
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


    [HttpGet("application-roles")]
    public async Task<IActionResult> GetApplicationRoles()
    {
        try
        {
            var roles = await _jiraServiceBase.GetApplicationRolesAsync();
            return Ok(roles);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

}