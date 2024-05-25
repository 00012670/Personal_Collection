using Microsoft.AspNetCore.Mvc;
using API.Context;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CollectionsController : ControllerBase
    {
        private readonly DBContext _context;

        public CollectionsController(DBContext context)
        {
            _context = context;
        }

        [HttpGet("GetCollections")]
        public async Task<ActionResult<IEnumerable<Collection>>> GetCollections()
        {
            return await _context.Collections.Include(c => c.User).ToListAsync();
        }

        [HttpGet("GetCollectionsByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Collection>>> GetCollectionsByUser(int userId)
        {
            var collections = await _context.Collections.Where(c => c.UserId == userId).Include(c => c.User).ToListAsync();
            if (!collections.Any())
            {
                return NotFound();
            }
            return collections;
        }

        [HttpGet("GetCollection/{id}")]
        public async Task<ActionResult<Collection>> GetCollection(int id)
        {
            var collection = await _context.Collections.FindAsync(id);
            if (collection == null)
            {
                return NotFound();
            }
            return collection;
        }

        [HttpPut("EditCollection/{id}")]
        public async Task<IActionResult> EditCollection(int id, Collection collection)
        {
            if (id != collection.CollectionId)
            {
                return BadRequest();
            }

            // Check if the user exists
            var userExists = await _context.Users.AnyAsync(u => u.UserId == collection.UserId);
            if (!userExists)
            {
                return BadRequest("User does not exist");
            }

            _context.Entry(collection).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CollectionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpPost("CreateCollection")]
        public async Task<ActionResult<Collection>> CreateCollection(Collection collection)
        {
            var user = await _context.Users.FindAsync(collection.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }
            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCollection", new { id = collection.CollectionId }, collection);
        }

        [HttpDelete("DeleteCollection/{id}")]
        public async Task<IActionResult> DeleteCollection(int id)
        {
            var collection = await _context.Collections.FindAsync(id);
            if (collection == null)
            {
                return NotFound();
            }
            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool CollectionExists(int id)
        {
            return _context.Collections.Any(e => e.CollectionId == id);
        }
    }
}