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

        [HttpGet("me")]
        public async Task<ActionResult<GetMeResponse>> GetMe()
        {
            var token = Request.Cookies["jwtToken"];
            if (string.IsNullOrEmpty(token))
                return Unauthorized(GetMeResponse.Fail("未登入"));

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]);

                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                }, out _);

                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(GetMeResponse.Fail("JWT 缺少使用者資訊"));

                var user = await _context.Users.FindAsync(Guid.Parse(userId));
                if (user == null)
                    return Unauthorized(GetMeResponse.Fail("使用者不存在"));

                var userDto = new UserDto
                {
                    Id = user.Id.ToString(),
                    Email = user.Email
                };

                return Ok(GetMeResponse.Ok(userDto));
            }
            catch (SecurityTokenExpiredException)
            {
                return Unauthorized(GetMeResponse.Fail("JWT 已過期"));
            }
            catch
            {
                return Unauthorized(GetMeResponse.Fail("JWT 驗證失敗"));
            }
        }




        // 用戶註冊
        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
        {
            // 檢查是否已有相同 Email
            var exists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (exists)
            {
                return Conflict(RegisterResponse.Fail("Email 已被註冊"));
            }

            // 建立新用戶
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                Password = request.Password,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 回傳 UserDto
            var userDto = new UserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email
            };

            return Ok(RegisterResponse.Ok(userDto, "註冊成功"));
        }



        // 用戶登入並產生 JWT
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
