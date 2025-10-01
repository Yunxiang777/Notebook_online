namespace notebook_back.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }      // 是否成功
        public string? Message { get; set; }   // 成功或錯誤訊息
        public T? Data { get; set; }           // 成功時回傳資料

        // 成功
        public static ApiResponse<T> Ok(T? data, string? message = null) =>
            new ApiResponse<T> { Success = true, Data = data, Message = message };

        // 登入失敗 fun
        public static ApiResponse<T> Fail(string message) =>
            new ApiResponse<T> { Success = false, Message = message };
    }
}
