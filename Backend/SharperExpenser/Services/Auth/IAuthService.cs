using SharperExpenser.Models;

namespace SharperExpenser.Services.Auth;

public interface IAuthService
{
    string GenerateToken(User user);
    int ValidateToken(string token);
    User? AuthenticateUser(string Password, User Expected);
}