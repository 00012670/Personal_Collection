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
            var collection = await _context.Collections.FindAsync(id);
            if (collection == null)
            {
                return NotFound(new { message = $"Collection with id {id} not found." });
            }
            return collection.Likes;
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
                return BadRequest("You already liked this collection");
            }
            userLike = new UserLike
            {
                UserId = userId,
                CollectionId = id
            };
            await _context.UserLikes.AddAsync(userLike);
            var collection = await _context.Collections.FindAsync(id);
            if (collection == null)
            {
                return NotFound("Collection not found");
            }
            collection.Likes++;
            _context.Entry(collection).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteLike/{userId}/{id}")]
        public async Task<ActionResult> DeleteLike(int userId, int id)
        {
            var userLike = await _context.UserLikes.FindAsync(userId, id);
            if (userLike == null)
            {
                return NotFound("You didn't like this collection");
            }
            _context.UserLikes.Remove(userLike);
            var collection = await _context.Collections.FindAsync(id);
            if (collection == null)
            {
                return NotFound("Collection not found");
            }
            collection.Likes--;
            _context.Entry(collection).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}