using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Goal;
public class UpdateGoalRequest : IValidatableObject
{
    [Range(0, int.MaxValue)]
    public int Id { get; init; }
    [Length(1, 50)]
    public string? UpdateGoalName { get; set; }
    public DateTime? UpdateEndDate { get; set; }
    [Range(0, 9999999.99, MinimumIsExclusive = true)]
    public decimal? UpdateMoneyToGather { get; set; }
    [StringLength(3)]
    public string? UpdateCurrency { get; set; }
    [Range(int.MinValue, int.MaxValue)]
    public int? UpdatePriority { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if(UpdateCurrency != null && UpdateCurrency == null)
        {
            yield return new ValidationResult("UpdateMoneyToGather is required when UpdateCurrency is provided.",
                new[] { nameof(UpdateMoneyToGather) });
        }
    }
}
