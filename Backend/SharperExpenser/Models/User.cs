namespace SharperExpenser.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Password_Hash { get; set; } = null!;
    public string saltString { get; set; } = "";
    public string Main_Currency { get; set; } = null!;
}