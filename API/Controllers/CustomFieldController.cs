using Microsoft.AspNetCore.Mvc;
using API.Context;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class CustomFieldController : ControllerBase
    {
        private readonly DBContext _context;

        public CustomFieldController(DBContext context)
        {
            _context = context;
        }

        [HttpGet("GetCustomField{id}")]
        public async Task<ActionResult<CustomField>> GetCustomField(int id)
        {
            var customField = await _context.CustomFields.FindAsync(id);

            if (customField == null)
            {
                return NotFound();
            }

            return customField;
        }

        [HttpPost("AddCustomField/{collectionId}")]
        public async Task<ActionResult<CustomField>> CreateCustomField(CustomField customField)
        {
            _context.CustomFields.Add(customField);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomField", new { id = customField.CustomFieldId }, customField);
        }

        [HttpPut("EditCustomField/{id}")]
        public async Task<IActionResult> EditCustomField(int id, CustomField customField)
        {
            if (id != customField.CustomFieldId)
            {
                return BadRequest();
            }

            _context.Entry(customField).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomFieldExists(id))
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

        [HttpDelete("DeleteCustomField/{id}")]
        public async Task<IActionResult> DeleteCustomField(int id)
        {
            var customField = await _context.CustomFields.FindAsync(id);
            if (customField == null)
            {
                return NotFound();
            }

            _context.CustomFields.Remove(customField);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomFieldExists(int id)
        {
            return _context.CustomFields.Any(e => e.CustomFieldId == id);
        }
    }
}