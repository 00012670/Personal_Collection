using System.ComponentModel.DataAnnotations.Schema;
using API.Models;

public class UserLike
{
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }
    public int CollectionId { get; set; }

    [ForeignKey("CollectionId")]
    public Collection? Collection { get; set; }
}
