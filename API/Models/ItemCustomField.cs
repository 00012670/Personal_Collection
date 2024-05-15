public class ItemCustomField
{
    public int ItemId { get; set; }
    public Item? Item { get; set; }
    public int CustomFieldId { get; set; }
    public CustomField? CustomField { get; set; }
    public string? Value { get; set; }
}