using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Transaction;

public class DeleteTransactionRequest
{
    [Range(0, int.MaxValue)]
    public int TransactionId { get; set; }
    public decimal ExchangeRate { get; set; } = 1;
}