using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Transaction;

public class UpsertTransactionRequest
{
    [Range(0, int.MaxValue)]
    public int id { get; set; }
    [Range(-99999999.99, 99999999.99, MinimumIsExclusive = true)]
    public decimal amount { get; set; }
    [StringLength(3)]
    public string currency { get; set; } = null!;
    public DateTime transactionDate { get; set; }
    [Length(1, 50)]
    [RegularExpression(@"^[A-z0-9\s]{0,50}$")]
    public string category { get; set; } = null!;
}