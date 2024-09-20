namespace SharperExpenser.Models;
public class Goal
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string GoalName { get; set; } = null!;
    public DateTime MoneyStartingPeriod { get; set; }
    public int Priority { get; set; }
    public decimal AmountAtTheStartOfMonth { get; set; }
    public decimal AdditionalAmount { get; set; }
    public decimal MoneyToGather { get; set; }
    public string Currency { get; set; } = null!;
    public bool IsFinished { get; set; }
}
