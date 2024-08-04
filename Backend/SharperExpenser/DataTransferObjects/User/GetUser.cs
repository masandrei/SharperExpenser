using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.User;

public record GetUserRequest
(
    [Range(0, int.MaxValue)]
    int Id
);