using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Transaction;

public class UpsertTransactionRequest
{
    [Range(0, int.MaxValue)]
    public int TransactionId { get; set; }
    [Range(-99999999.99, 99999999.99, MinimumIsExclusive = true)]
    public decimal TransactionAmount { get; set; }
    [StringLength(3)]
    public string TransactionCurrency { get; set; } = null!;
    public DateTime TransactionDate { get; set; }
    [Length(1, 50)]
    [RegularExpression(@"^[A-z0-9\s]{0,50}$")]
    public string TransactionCategory { get; set; } = null!;
}