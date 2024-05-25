using API.Models;

public class Collection
{
  public int CollectionId { get; set; }
  public string? Name { get; set; }
  public string? Description { get; set; }
  public int UserId { get; set; }
  public User? User { get; set; }
  public int Likes { get; set; }
  public CollectionCategory Category { get; set; }
  public ICollection<UserLike>? UserLikes { get; set; }
  public List<CustomField>? CustomFields { get; set; }
  public List<Item>? Items { get; set; }

  public enum CollectionCategory
  {
    Books,
    Stamps,
    Coins,
    Art,
    Antiques,
    Memorabilia,
    Photographs,
    Other
  }
}