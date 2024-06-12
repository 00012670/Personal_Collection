
    public class JiraUser
    {
        public string Self { get; set; }
        public string AccountId { get; set; }
        public string AccountType { get; set; }
        public string EmailAddress { get; set; }
        public Dictionary<string, string> AvatarUrls { get; set; }
        public string DisplayName { get; set; }
        public bool Active { get; set; }
        public string Locale { get; set; }
    }