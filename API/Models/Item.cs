public class Item
{
    public int ItemId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int CollectionId { get; set; }
    public Collection? Collection { get; set; }
    public int Likes { get; set; }
    public List<UserLike>? UserLikes { get; set; }
}

