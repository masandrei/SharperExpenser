using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Goal;

public class DeleteGoalRequest
{
    [Range(0, int.MaxValue)]
    public int Id { get; set; }
    [Range(0, double.MaxValue, MinimumIsExclusive = true)]
    public decimal ExchangeRate { get; set; }
}
