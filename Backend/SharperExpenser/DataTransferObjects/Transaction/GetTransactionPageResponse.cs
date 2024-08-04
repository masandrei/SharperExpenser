namespace SharperExpenser.DataTransferObjects.Transaction;

public class GetTransactionPageResponse
{
    public List<IGrouping<DateTime, Models.Transaction>> transactionPage { get; set; } = null!;
    public int nextPageCursorId { get; set; }
    public DateTime nextPageCursorDate { get; set; }
}