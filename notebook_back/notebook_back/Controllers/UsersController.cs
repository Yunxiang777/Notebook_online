using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; 
using notebook_back.Data;
using notebook_back.Models; 
using System.Security.Claims;
using notebook_back.DTOs;
using notebook_back.Helpers;

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

        // 取得目前登入的用戶 (透過 JWT)
        [HttpGet("me")]
        public async Task<ActionResult<GetMeResponse>> GetMe()
        {
            var token = Request.Cookies["jwtToken"];
            if (string.IsNullOrEmpty(token))
                return Unauthorized(GetMeResponse.Fail("未登入"));

            try
            {
                var principal = JwtHelper.ValidateJwtToken(token, _config["Jwt:SecretKey"]);
                var userId = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(GetMeResponse.Fail("JWT 缺少使用者資訊"));

                var user = await _context.Users.FindAsync(Guid.Parse(userId));
                if (user == null)
                    return Unauthorized(GetMeResponse.Fail("使用者不存在"));

                return Ok(GetMeResponse.Ok(UserMapper.ToUserDto(user)));
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

            return Ok(RegisterResponse.Ok(UserMapper.ToUserDto(user), "註冊成功"));
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
            var tokenString = JwtHelper.GenerateJwtToken(
                user,
                _config["Jwt:SecretKey"],
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"]
            );

            // 存到 HttpOnly Cookie
            Response.Cookies.Append("jwtToken", tokenString, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            return Ok(LoginResponse.Ok(UserMapper.ToUserDto(user), "登入成功"));
        }

        // 登出
        [HttpPost("logout")]
        public ActionResult<LogoutResponse> Logout()
        {
            Response.Cookies.Delete("jwtToken");
            return Ok(LogoutResponse.Ok("已登出"));
        }

    }

}
