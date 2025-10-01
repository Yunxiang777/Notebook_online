using Microsoft.AspNetCore.Authentication.JwtBearer; 
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using notebook_back.Data;
using System.Text;

// �إ� Web ���ε{���غc���]Ū�� appsettings, DI container, environment ���^
var builder = WebApplication.CreateBuilder(args);

// Ū�� SecretKey ��r���ন byte[]�]�N�ӧ@����٪��_�^
var secretKey = builder.Configuration["Jwt:SecretKey"];
var key = Encoding.UTF8.GetBytes(secretKey); // ��r���ন byte[]�]�N�ӧ@����٪��_�^

// ���U DbContext (SQL Server)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// �[�J CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173") // ���\���e�ݨӷ�
            .AllowAnyHeader()    // ���\�Ҧ� Header
            .AllowCredentials()  // ���\�s�����a cookie/�{�Ҹ�T
            .AllowAnyMethod());  // ���\���N HTTP ��k (GET/POST/PUT/DELETE...)
});

// JWT ����
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

// ���U Controllers
builder.Services.AddControllers();
// �غc App�]��Ҧ� service �P middleware pipeline �ǳƦn�^
var app = builder.Build();

// Middleware
app.UseCors("AllowFrontend"); // �ҥΤ��e�w�q�� CORS policy
app.UseHttpsRedirection(); // �j�� HTTP -> HTTPS ���s�ɦV�]�Ͳ����ҫ�ĳ�ҥΡ^
app.UseAuthentication(); // �ҥ����Ҥ����n��]�N�������ҽШD�A���� User principal�^
app.UseAuthorization();  // �ҥα��v�����n��]���w���Ҫ� User �P�_�O�_�i�s���귽�^
app.MapControllers(); // �N���U�� Controller endpoint �M�g�����

app.Run();
