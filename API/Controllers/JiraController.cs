
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

[ApiController]
[Route("[controller]")]
public class JiraController : ControllerBase
{

    private readonly JiraServiceBase _jiraServiceBase;
    private readonly JiraIssueService _jiraService;
    private readonly JiraUserService _jiraUserService;

    private readonly IOptions<JiraSettings> _jiraSettings;

    public JiraController(IOptions<JiraSettings> jiraSettings, JiraServiceBase jiraServiceBase, JiraIssueService jiraService, JiraUserService jiraUserService)
    {
        _jiraServiceBase = jiraServiceBase;
        _jiraService = jiraService;
        _jiraUserService = jiraUserService;
        _jiraSettings = jiraSettings;
    }


    [HttpPost("create-jira-ticket")]
    public async Task<IActionResult> CreateJiraTicket([FromBody] JiraTicketRequest request)
    {
        var ticketKey = await _jiraService.CreateIssue(request.Summary, request.Username, request.Reported, request.Collection, request.Link, request.Priority);
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

    [HttpGet("get-all-users")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _jiraUserService.GetAllUsers();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("get-all-issues")]
    public async Task<IActionResult> GetAllIssues()
    {
        try
        {
            var issues = await _jiraService.GetAllIssues();
            return Ok(issues);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
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
}