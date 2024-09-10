namespace SharperExpenser.DataTransferObjects.Goal;
public class UpdateGoalRequest
{
    public int Id { get; init; }
    public string? UpdateGoalName { get; set; }
    public DateTime? UpdateEndDate { get; set; }
    public decimal? UpdateMoneyToGather { get; set; }
    public string? UpdateCurrency { get; set; }
    public int? UpdatePriority { get; set; }
}
