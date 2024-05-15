public class Item
{
    public int ItemId { get; set; }
    public string? Name { get; set; }
    public int CollectionID { get; set; }
    public Collection? Collection { get; set; }
    public List<CustomField>? CustomFields { get; set; }
    public List<ItemCustomField>? ItemCustomFields { get; set; }
    public List<ItemTag>? Tags { get; set; }

}

