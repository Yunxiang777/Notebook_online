namespace notebook_back.DTOs
{
    public class RegisterResponse
    {
        public bool Success { get; set; }       // 是否成功
        public string? Message { get; set; }    // 訊息
        public UserDto? Data { get; set; }      // 成功時回傳 User

        // 成功
        public static RegisterResponse Ok(UserDto? data, string? message = null) =>
            new RegisterResponse
            {
                Success = true,
                Data = data,
                Message = message
            };

        // 失敗
        public static RegisterResponse Fail(string message) =>
            new RegisterResponse
            {
                Success = false,
                Data = null,
                Message = message
            };
    }
}
