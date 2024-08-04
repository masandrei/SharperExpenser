using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.User;

public record UserResponse
(
    [EmailAddress]
    string Email,
    [StringLength(3)]
    string Main_Currency
);