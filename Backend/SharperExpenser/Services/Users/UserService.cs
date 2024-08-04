using SharperExpenser.DataBaseContexts;
using SharperExpenser.Models;
using SharperExpenser.Helpers;

namespace SharperExpenser.Services.Users;

public class UserService : IUsersService
{
    private readonly ApplicationContext _context;

    public UserService(ApplicationContext context)
    {
        _context = context;
    }

    public void CreateUser(User user)
    {
        byte[] saltBytes = HashingHelper.GenerateSalt();
        string hashPassword = HashingHelper.HashPassword(user.Password_Hash, saltBytes);
        user.saltString = Convert.ToBase64String(saltBytes);
        user.Password_Hash = hashPassword;
        _context.UserRecords.Add(user);
        _context.SaveChangesAsync();
    }
    

    public User? GetUser(int id)
    {
        var UsersQuery = from users in _context.UserRecords
                        where users.Id == id
                        select users;
        User? user = UsersQuery.FirstOrDefault();
        return user;
    }
    public User? GetUser(string Email)
    {
        var UsersQuery = from users in _context.UserRecords
                        where users.Email == Email
                        select users;
        User? user = UsersQuery.FirstOrDefault();
        return user;
    }
    public void UpdateUser(User user)
    {
        _context.UserRecords.Update(user);
        _context.SaveChangesAsync();
    }
}