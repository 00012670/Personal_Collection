
    public class JiraUser
    {
        public string AccountId { get; set; }
        public string Email { get; set; }

        public string Username { get; set; }
        public Dictionary<string, string> AvatarUrls { get; set; }
        public string DisplayName { get; set; }
        public bool Active { get; set; }
        public string Locale { get; set; }
    }