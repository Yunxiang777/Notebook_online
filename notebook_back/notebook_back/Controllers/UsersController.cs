using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using notebook_back.Data;
using notebook_back.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace notebook_back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public UsersController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 取得所有用戶（測試用）
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // 新增用戶
        [HttpPost]
        public async Task<ActionResult<ApiResponse<User>>> CreateUser(User user)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email == user.Email);
            if (exists)
            {
                return Conflict(ApiResponse<User>.Fail("Email 已被註冊"));
            }

            user.Id = Guid.NewGuid();
            user.CreatedAt = DateTime.UtcNow;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<User>.Ok(user));
        }

        // 登入並產生 JWT
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<string>>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.Password != request.Password)
                return Unauthorized(ApiResponse<string>.Fail("帳號或密碼錯誤"));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("role", "User")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // 🔑 把 JWT 存 Cookie
            Response.Cookies.Append("jwtToken", tokenString, new CookieOptions
            {
                HttpOnly = true, // 前端 JS 無法讀
                Secure = true,   // 只能 HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            return Ok(ApiResponse<string>.Ok("登入成功"));
        }


        // 受保護的 API (需要 JWT)
        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<User>> GetProfile()
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (user == null) return NotFound();

            return user;
        }
    }

    // DTO
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
