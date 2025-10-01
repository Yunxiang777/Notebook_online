using Microsoft.AspNetCore.Authentication.JwtBearer; 
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using notebook_back.Data;
using System.Text;

// 建立 Web 應用程式建構器（讀取 appsettings, DI container, environment 等）
var builder = WebApplication.CreateBuilder(args);

// 讀取 SecretKey 把字串轉成 byte[]（將來作為對稱金鑰）
var secretKey = builder.Configuration["Jwt:SecretKey"];
var key = Encoding.UTF8.GetBytes(secretKey); // 把字串轉成 byte[]（將來作為對稱金鑰）

// 註冊 DbContext (SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 加入 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173") // 允許的前端來源
            .AllowAnyHeader()    // 允許所有 Header
            .AllowCredentials()  // 允許瀏覽器帶 cookie/認證資訊
            .AllowAnyMethod());  // 允許任意 HTTP 方法 (GET/POST/PUT/DELETE...)
});

// JWT 驗證
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// 註冊 Controllers
builder.Services.AddControllers();
// 建構 App（把所有 service 與 middleware pipeline 準備好）
var app = builder.Build();

// Middleware
app.UseCors("AllowFrontend"); // 啟用之前定義的 CORS policy
app.UseHttpsRedirection(); // 強制 HTTP -> HTTPS 重新導向（生產環境建議啟用）
app.UseAuthentication(); // 啟用驗證中介軟體（將嘗試驗證請求，產生 User principal）
app.UseAuthorization();  // 啟用授權中介軟體（基於已驗證的 User 判斷是否可存取資源）
app.MapControllers(); // 將註冊的 Controller endpoint 映射到路由

app.Run();
