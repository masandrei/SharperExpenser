using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Goal;
public class CreateGoalRequest
{
    [Length(1, 50)]
    public string CreateGoalName { get; set; } = null!;
    [Range(0, 99999999.99, MinimumIsExclusive = true)]
    public decimal CreateMoneyToGather { get; set; }
    [StringLength(3)]
    public string CreateCurrency { get; set; } = null!;
}
