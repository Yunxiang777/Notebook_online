using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; 
using notebook_back.Data;
using notebook_back.Models; 
using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims;
using System.Text;
using notebook_back.DTOs;

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

        // 取得所有用戶
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // 新增用戶
        [HttpPost]
        public async Task<ActionResult<ApiResponse<User>>> CreateUser(User user)
        {
            // 檢查是否已有相同 Email
            var exists = await _context.Users.AnyAsync(u => u.Email == user.Email);
            if (exists)
            {
                return Conflict(ApiResponse<User>.Fail("Email 已被註冊"));
            }

            // 寫入db
            user.Id = Guid.NewGuid();
            user.CreatedAt = DateTime.UtcNow; 
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<User>.Ok(user, "註冊成功"));
        }

        // 登入並產生 JWT
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // 登入失敗
            if (user == null || user.Password != request.Password)
                return Unauthorized(LoginResponse.Fail("帳號或密碼錯誤"));

            // 生成 JWT
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
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

            // 存到 HttpOnly Cookie
            Response.Cookies.Append("jwtToken", tokenString, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            // 回傳 user DTO
            var userDto = new UserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email
            };

            return Ok(LoginResponse.Ok(userDto, "登入成功"));
        }


    }

}
