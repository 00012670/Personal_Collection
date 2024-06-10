
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class JiraController : ControllerBase
{
    private readonly JiraService _jiraService;

    public JiraController(JiraService jiraService)
    {
        _jiraService = jiraService;
    }

    [HttpPost("create-jira-ticket")]
    public async Task<IActionResult> CreateJiraTicket([FromBody] JiraTicketRequest request)
    {
        var ticketKey = await _jiraService.CreateJiraTicket(request.Summary, request.Priority, request.Collection, request.Link);
        return Ok(new { key = ticketKey });
    }
}