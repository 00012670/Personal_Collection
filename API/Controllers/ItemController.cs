using Microsoft.AspNetCore.Mvc;
using API.Context;

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

        [HttpPost("AddCustomFieldValue/{itemId}")]
        public async Task<ActionResult<ItemCustomField>> AddCustomFieldValue(int itemId, ItemCustomField customFieldValue)
        {
            var item = await _context.Items.FindAsync(itemId);
            if (item == null)
            {
                return NotFound();
            }

            customFieldValue.ItemId = itemId;
            _context.ItemCustomFields.Add(customFieldValue);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomFieldValue", new { id = customFieldValue.ItemId }, customFieldValue);
        }
    }
}