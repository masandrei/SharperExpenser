using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SharperExpenser.Models;
using SharperExpenser.Helpers;
using Microsoft.IdentityModel.Tokens;

namespace SharperExpenser.Services.Auth;

public class AuthService : IAuthService
{
    public string GenerateToken(User user)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(AuthSettings.PrivateKey);
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim("userId", user.Id.ToString())
            }
            ),
            Expires = DateTime.UtcNow.AddDays(15),
            SigningCredentials = credentials
        };

        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    public int ValidateToken(string token)
    {
        token = token.Replace("Bearer ", "");
        var tokenHandler = new JwtSecurityTokenHandler();

        var jwtToken = tokenHandler.ReadJwtToken(token);
        var claims = jwtToken.Claims;
        if(Int32.TryParse(claims.FirstOrDefault(claim => claim.Type == "userId")?.Value, out int UserId))
        {
            return UserId;
        }
        return -1;
    }

    public User? AuthenticateUser(string Password, User user)
    {
        string EnteredPasswordHash = HashingHelper.HashPassword(Password, Convert.FromBase64String(user.saltString));
        if(EnteredPasswordHash == user.Password_Hash)
        {
            return user;
        }
        return null;
    }

}