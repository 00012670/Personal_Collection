using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Context;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly DBContext _context;

        public LikesController(DBContext context)
        {
            _context = context;
        }

        [HttpGet("GetLikes/{id}")]
        public async Task<ActionResult<int>> GetLikes(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { message = $"Item with id {id} not found." });
            }
            return item.Likes;
        }

        [HttpGet("HasLiked/{userId}/{id}")]
        public async Task<ActionResult<bool>> HasLiked(int userId, int id)
        {
            var userLike = await _context.UserLikes.FindAsync(userId, id);
            return userLike != null;
        }

        [HttpPost("AddLike/{userId}/{id}")]
        public async Task<ActionResult> AddLike(int userId, int id)
        {
            var userLike = await _context.UserLikes.FindAsync(userId, id);
            if (userLike != null)
            {
                return BadRequest("You already liked this item");
            }
            userLike = new UserLike
            {
                UserId = userId,
                ItemId = id
            };
            await _context.UserLikes.AddAsync(userLike);
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound("Item not found");
            }
            item.Likes++;
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteLike/{userId}/{id}")]
        public async Task<ActionResult> DeleteLike(int userId, int id)
        {
            var userLike = await _context.UserLikes.FindAsync(userId, id);
            if (userLike == null)
            {
                return NotFound("You didn't like this item");
            }
            _context.UserLikes.Remove(userLike);
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound("Item not found");
            }
            item.Likes--;
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}