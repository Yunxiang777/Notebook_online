using notebook_back.Models;
using notebook_back.DTOs;

namespace notebook_back.Helpers
{
    public static class UserMapper
    {
        public static UserDto ToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email
            };
        }
    }
}
