namespace notebook_back.DTOs
{
    public class LoginResponse
    {
        public bool Success { get; set; }       // 是否成功
        public string? Message { get; set; }    // 成功或錯誤訊息
        public UserDto? Data { get; set; }      // 成功時回傳使用者資料

        // 成功
        public static LoginResponse Ok(UserDto? data, string? message = null) =>
            new LoginResponse
            {
                Success = true,
                Data = data,
                Message = message
            };

        // 失敗
        public static LoginResponse Fail(string message) =>
            new LoginResponse
            {
                Success = false,
                Message = message,
                Data = null
            };
    }

}
