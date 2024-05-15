using API.Models;

public class Collection
{
    public int CollectionId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
  //  public string? ImageURL { get; set; }
    public int UserID { get; set; }
    public User? User { get; set; }
    public int CategoryID { get; set; }
    public Category? Category { get; set; }
    public List<CustomField>? CustomFields { get; set; }
    public List<Item>? Items { get; set; }
}