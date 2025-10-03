using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using notebook_back.Data;
using notebook_back.Models;
using notebook_back.Helpers;

namespace notebook_back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 需要登入才能操作
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotesController(AppDbContext context)
        {
            _context = context;
        }

        // DTOs
        public class CreateNoteRequest
        {
            public required string Title { get; set; }
            public required string Content { get; set; }
            public List<string> Tags { get; set; } = new List<string>();
        }

        public class UpdateNoteRequest
        {
            public required string Title { get; set; }
            public required string Content { get; set; }
            public List<string> Tags { get; set; } = new List<string>();
        }

        // 取得目前使用者的筆記
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var notes = await _context.Notes
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.UpdatedAt)
                .ToListAsync();

            return Ok(notes);
        }

        // 新增筆記
        [HttpPost]
        public async Task<ActionResult<Note>> CreateNote([FromBody] CreateNoteRequest request)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var note = new Note
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                Title = request.Title,
                Content = request.Content,
                TagList = request.Tags,   // <-- 這裡改成 TagList
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotes), new { }, note);
        }

        // 更新筆記
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(Guid id, [FromBody] UpdateNoteRequest request)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var existingNote = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (existingNote == null) return NotFound("找不到該筆記或無權限");

            existingNote.Title = request.Title;
            existingNote.Content = request.Content;
            existingNote.TagList = request.Tags;  // <-- 改成 TagList
            existingNote.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 刪除筆記
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(Guid id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note == null) return NotFound("找不到該筆記或無權限");

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
