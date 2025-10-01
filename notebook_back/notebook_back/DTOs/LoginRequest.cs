namespace notebook_back.DTOs
{
    public class LoginRequest
    {
        public required string Email { get; set; }  // 用戶輸入的 Email
        public required string Password { get; set; }  // 用戶輸入的 Password
    }
}
