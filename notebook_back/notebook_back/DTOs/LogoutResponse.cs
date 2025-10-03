namespace notebook_back.DTOs
{
    public class LogoutResponse
    {
        public bool Success { get; set; }       // 是否成功
        public string? Message { get; set; }    // 成功或錯誤訊息

        public static LogoutResponse Ok(string? message = null)
            => new LogoutResponse { Success = true, Message = message };

        public static LogoutResponse Fail(string message)
            => new LogoutResponse { Success = false, Message = message };
    }
}
