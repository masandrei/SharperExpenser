using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Goal;
public class UpdateGoalRequest : IValidatableObject
{
    [Range(0, int.MaxValue)]
    public int Id { get; init; }
    [Length(1, 50)]
    public string? UpdateGoalName { get; set; }
    [Range(0, 9999999.99, MinimumIsExclusive = true)]
    public decimal? UpdateMoneyToGather { get; set; }
    [StringLength(3)]
    public string? UpdateCurrency { get; set; }
    [Range(int.MinValue, int.MaxValue)]
    public int? UpdatePriority { get; set; }
    public decimal? ExchangeRate { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        List<ValidationResult> validationResults = new List<ValidationResult>();
        if(UpdateCurrency != null && UpdateMoneyToGather == null)
        {
            validationResults.Add(new ValidationResult("UpdateMoneyToGather is required when UpdateCurrency is provided.",
                new[] { nameof(UpdateMoneyToGather) }));
        }
        if(UpdatePriority != null && ExchangeRate == null)
        {
            validationResults.Add(new ValidationResult("When priority is changed, exchange rate is required", new[] { nameof(ExchangeRate) }));
        }
        return validationResults;
    }
}
