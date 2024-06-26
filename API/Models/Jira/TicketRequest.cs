public class TicketRequest
{
    public string? Summary { get; set; }

    public string? Username { get; set; }
    public string? Reported { get; set; }
    public string? Collection { get; set; }
    public Uri? Link { get; set; }
    public string? Priority { get; set; }
    public List<string>? ApplicationRoles { get; set; }
}