using System.ComponentModel.DataAnnotations.Schema;
using API.Models;

public class UserLike
{
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }
    public int ItemId { get; set; }

    [ForeignKey("ItemId")]
    public Item? Item { get; set; }
}
