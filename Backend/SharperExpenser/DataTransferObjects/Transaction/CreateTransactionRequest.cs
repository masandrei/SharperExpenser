using SharperExpenser.Helpers.Validation;
using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Transaction;

public class CreateTransactionRequest
{
    [DateValidation(ErrorMessage = "Date of transaction can't be later than now")]
    public DateTime TransactionDate { get; set; }
    [Range(-99999999.99, 99999999.99, MinimumIsExclusive = true)]
    public decimal Amount { get; set; }
    [Length(3,3)]
    public string Currency { get; set; } = null!;
    [Length(1,50)]
    [RegularExpression(@"^[A-z0-9\s]{0,50}$")]
    public string Category { get; set; } = null!;
    public decimal ExchangeRate { get; set; } = 1M;
}