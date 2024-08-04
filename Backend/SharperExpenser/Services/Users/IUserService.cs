using SharperExpenser.Models;

namespace SharperExpenser.Services.Users;

public interface IUsersService
{
    User? GetUser(int Id);
    User? GetUser(string Email);
    void CreateUser(User user);
    void UpdateUser(User user);
}