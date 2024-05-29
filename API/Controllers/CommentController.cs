using System.Linq;
using Microsoft.AspNetCore.Mvc;
using API.Context;
using API.Models;
using Microsoft.EntityFrameworkCore;

[Route("[controller]")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly DBContext _context;

    public CommentController(DBContext context)
    {
        _context = context;
    }

    [HttpGet("AllComments")]
    public ActionResult<IEnumerable<Comment>> GetAllComments()
    {
        var comments = _context.Comments.ToList();
        if (comments == null)
        {
            return NotFound();
        }
        return comments;
    }

    [HttpGet("{itemId}")]
    public ActionResult<IEnumerable<Comment>> GetComments(int itemId)
    {
        var comments = _context.Comments.Include(c => c.User).Where(c => c.ItemId == itemId).ToList();
        if (comments == null)
        {
            return NotFound();
        }
        return comments;
    }

    [HttpGet("GetComment/{id}")]
    public ActionResult<Comment> GetComment(int id)
    {
        var comment = _context.Comments.Find(id);
        if (comment == null)
        {
            return NotFound();
        }
        return comment;

    }

    [HttpPost("AddComment/{itemId}")]
    public ActionResult<Comment> AddComment(int itemId, Comment comment)
    {
      
        var item = _context.Items.Find(itemId);
        if (item == null)
        {
            return NotFound("Item not found");
        }
        comment.ItemId = itemId;
        _context.Comments.Add(comment);
        _context.SaveChanges();
        return CreatedAtAction("GetComment", new { id = comment.CommentId }, comment);
    }
}