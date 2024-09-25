using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Goal;
public class UpdateGoalRequest
{
    [Range(0, int.MaxValue)]
    public int Id { get; init; }
    [Length(1, 50)]
    public string? GoalName { get; set; }
    [Range(0, 9999999.99, MinimumIsExclusive = true)]
    public decimal? MoneyToGather { get; set; }
    [StringLength(3)]
    public string? UpdateCurrency { get; set; }
    [Range(int.MinValue, int.MaxValue)]
    public int? UpdatePriority { get; set; }
    public decimal? ExchangeRate { get; set; }

}
