using Newtonsoft.Json;

public class SearchResponse
{
    [JsonProperty("issues")]
    public List<JiraTicketRequest> Issues { get; set; } = new List<JiraTicketRequest>();
}