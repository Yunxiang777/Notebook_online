using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace notebook_back.Models
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }  // 關聯到 User

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        // 真正存資料庫的欄位
        public string? Tags { get; set; } = "[]"; // 存 JSON

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // NotMapped 屬性，程式操作用 List<string>
        [NotMapped]
        public List<string> TagList
        {
            get => string.IsNullOrEmpty(Tags) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(Tags)!;
            set => Tags = JsonSerializer.Serialize(value);
        }
    }
}
