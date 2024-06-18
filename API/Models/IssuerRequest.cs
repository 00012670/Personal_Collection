
    public class IssueRequest
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string DisplayName { get; set; }
        public List<string> ApplicationRoles { get; set; }
        public string IssueSummary { get; set; }
        public string Collection { get; set; }
        public Uri Link { get; set; }
        public string Priority { get; set; }
    }