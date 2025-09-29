namespace notebook_back.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }      // 是否成功
        public string? Message { get; set; }   // 成功或錯誤訊息
        public T? Data { get; set; }           // 成功時回傳資料

        // 建議可加靜態方法快速生成
        public static ApiResponse<T> Ok(T data) =>
            new ApiResponse<T> { Success = true, Data = data };

        public static ApiResponse<T> Fail(string message) =>
            new ApiResponse<T> { Success = false, Message = message };
    }
}
