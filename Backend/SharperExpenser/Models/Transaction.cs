using System.ComponentModel.DataAnnotations.Schema;

namespace SharperExpenser.Models;

public class Transaction
{
    public int Id { get; set; }
    public int UserId{ get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public DateTime TransactionDate { get; set; }
    public string Category { get; set; } = null!;

}