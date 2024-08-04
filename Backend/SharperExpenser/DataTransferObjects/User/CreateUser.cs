using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.User;

public record CreateUserRequest(
    [EmailAddress]
    string Email,
    [Length(6,50)]
    [RegularExpression(@"^[A-z0-9'.']{0,50}$")]
    string Password,
    [StringLength(3)]
    string Main_Currency
);