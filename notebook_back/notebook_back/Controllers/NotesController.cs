using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using notebook_back.Data;
using notebook_back.Models;

namespace NotepadApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotesController(AppDbContext context)
        {
            _context = context;
        }

        // 取得指定使用者的筆記
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Note>>> GetNotes(Guid userId)
        {
            return await _context.Notes.Where(n => n.UserId == userId).ToListAsync();
        }

        // 新增筆記
        [HttpPost]
        public async Task<ActionResult<Note>> CreateNote(Note note)
        {
            note.Id = Guid.NewGuid();
            note.CreatedAt = DateTime.UtcNow;
            note.UpdatedAt = DateTime.UtcNow;

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotes), new { userId = note.UserId }, note);
        }

        // 更新筆記
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(Guid id, Note note)
        {
            if (id != note.Id) return BadRequest();

            note.UpdatedAt = DateTime.UtcNow;
            _context.Entry(note).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // 刪除筆記
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(Guid id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null) return NotFound();

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
