using Newtonsoft.Json;

public class SearchResponse
{
    [JsonProperty("issues")]
    public List<TicketRequest> Issues { get; set; } = new List<TicketRequest>();
}