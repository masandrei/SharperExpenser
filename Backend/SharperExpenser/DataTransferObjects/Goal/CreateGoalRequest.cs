namespace SharperExpenser.DataTransferObjects.Goal;
public class CreateGoalRequest
{
    public string CreateGoalName { get; set; } = null!;
    public DateTime? CreateEndDate { get; set; }
    public decimal CreateMoneyToGather { get; set; }
    public string CreateCurrency { get; set; } = null!;
}
