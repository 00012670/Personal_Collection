using Microsoft.AspNetCore.Mvc;
using API.Context;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly DBContext _context;

        public ItemsController(DBContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllItems")]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            return await _context.Items.ToListAsync();
        }

        [HttpGet("GetItemByCollection/{collectionId}")]
        public async Task<ActionResult<IEnumerable<Item>>> GetItemsByCollection(int collectionId)
        {
            var items = await _context.Items.Where(i => i.CollectionId == collectionId).ToListAsync();

            if (items == null || !items.Any())
            {
                return NotFound();
            }

            return items;
        }

        [HttpGet("GetItem/{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        [HttpPut("UpdateItem/{id}")]
        public async Task<IActionResult> UpdateItem(int id, Item item)
        {
            if (id != item.ItemId)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
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

        [HttpPost("AddItem/{id}")]
        public async Task<ActionResult<Item>> AddItem(Item item, [FromQuery] int collectionId)
        {
            var collection = await _context.Collections.FindAsync(collectionId);
            if (collection == null)
            {
                return NotFound("Collection not found");
            }

            item.CollectionId = collectionId;
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItem", new { id = item.ItemId }, item);
        }

        [HttpDelete("DeleteItem/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.ItemId == id);
        }
    }
}