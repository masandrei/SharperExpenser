using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.User;

public record UpsertUserRequest
(
    [Range(0, int.MaxValue)]
    int Id,
    [EmailAddress]
    string Email,
    [Length(6,50)]
    [RegularExpression(@"^[A-z0-9'.']{0,50}$")]
    string Password,
    [StringLength(3)]
    string MainCurr
);