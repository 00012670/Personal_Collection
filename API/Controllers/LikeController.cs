using Microsoft.AspNetCore.Mvc;
using API.Services;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly LikeService _likeService;

        public LikesController(LikeService likeService)
        {
            _likeService = likeService;
        }


        [HttpGet("GetLikes/{id}")]
        public async Task<ActionResult<int>> GetLikes(int id)
        {
            var item = await _likeService.FindItem(id);
            if (item == null)
            {
                return NotFound(new { message = $"Item with id {id} not found." });
            }
            return item.Likes;
        }

        [HttpGet("HasLiked/{userId}/{id}")]
        public async Task<ActionResult<bool>> HasLiked(int userId, int id)
        {
            var userLike = await _likeService.FindUserLike(userId, id);
            return userLike != null;
        }

        [HttpPost("AddLike/{userId}/{id}")]
        public async Task<ActionResult> AddLike(int userId, int id)
        {
            var userLike = await _likeService.FindUserLike(userId, id);
            if (userLike != null)
            {
                return BadRequest(new { message = "You already liked this item" });
            }
            await _likeService.AddUserLike(userId, id);
            var item = await _likeService.FindItem(id);
            if (item == null)
            {
                return NotFound(new { message = "Item not found" });
            }
            await _likeService.IncrementItemLikes(item);
            return Ok();
        }

        [HttpDelete("DeleteLike/{userId}/{id}")]
        public async Task<ActionResult> DeleteLike(int userId, int id)
        {
            var userLike = await _likeService.FindUserLike(userId, id);
            if (userLike == null)
            {
                return NotFound(new { message = "You didn't like this item" });
            }
            await _likeService.RemoveUserLike(userLike);
            var item = await _likeService.FindItem(id);
            if (item == null)
            {
                return NotFound(new { message = "Item not found" });
            }
            await _likeService.DecrementItemLikes(item);
            return Ok();
        }
    }
}