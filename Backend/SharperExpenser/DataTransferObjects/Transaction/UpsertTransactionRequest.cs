using SharperExpenser.Helpers.Validation;
using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Transaction;

public class UpsertTransactionRequest
{
    [Range(0, int.MaxValue)]
    public int Id { get; init; }
    [Range(-99999999.99, 99999999.99, MinimumIsExclusive = true)]
    public decimal? Amount { get; set; }
    [DateValidation(ErrorMessage = "Transaction Date can't be later than now")]
    public DateTime? TransactionDate { get; set; }
    [Length(1, 50)]
    [RegularExpression(@"^[A-z0-9\s]{0,50}$")]
    public string? Category { get; set; }
    public decimal NewExchangeRate { get; set; }
    public decimal OldExchangeRate { get; set; }
}