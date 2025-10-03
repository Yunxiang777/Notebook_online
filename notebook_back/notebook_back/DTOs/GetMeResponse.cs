// DTOs/GetMeResponse.cs
namespace notebook_back.DTOs
{
    public class GetMeResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public UserDto? Data { get; set; }

        public static GetMeResponse Ok(UserDto user, string? message = null) =>
            new GetMeResponse
            {
                Success = true,
                Data = user,
                Message = message ?? "取得成功"
            };

        public static GetMeResponse Fail(string message) =>
            new GetMeResponse
            {
                Success = false,
                Data = null,
                Message = message
            };
    }
}
