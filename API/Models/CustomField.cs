public class CustomField
{
    public int CustomFieldId { get; set; }
    public string? Name { get; set; }
    public FieldType Type { get; set; }
    public int CollectionId { get; set; }
    public Collection? Collection { get; set; }
    public List<ItemCustomField>? ItemCustomFields { get; set; } 
}

public enum FieldType
{
    String,
    Int,
    Text,
    Boolean, 
    Date
}