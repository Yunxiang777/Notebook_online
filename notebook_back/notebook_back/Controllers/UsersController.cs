using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using notebook_back.Data;
using notebook_back.Models;

namespace notebook_back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // 取得所有用戶
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // 依 Email 找用戶
        [HttpGet("findByEmail/{email}")]
        public async Task<ActionResult<User>> FindUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound(); // 回傳 404
            }

            return user; // 回傳 200 + User JSON
        }


        // 新增用戶
        [HttpPost]
        public async Task<ActionResult<ApiResponse<User>>> CreateUser(User user)
        {
            // 先檢查 Email 是否已存在
            var exists = await _context.Users.AnyAsync(u => u.Email == user.Email);
            if (exists)
            {
                // 回傳統一 ApiResponse 格式 + HTTP 409
                return Conflict(ApiResponse<User>.Fail("Email 已被註冊"));
            }

            // 建立新用戶
            user.Id = Guid.NewGuid();
            user.CreatedAt = DateTime.UtcNow;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 回傳成功 ApiResponse
            return Ok(ApiResponse<User>.Ok(user));
        }

    }
}
