using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Transaction;

public class DeleteTransactionRequest
{
    [Range(0, int.MaxValue)]
    public int TransactionId { get; set; }
}