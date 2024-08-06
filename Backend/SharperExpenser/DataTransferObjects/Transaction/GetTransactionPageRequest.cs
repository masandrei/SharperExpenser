using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Transaction;

public class GetTransactionPageRequest
{
    [Range(1, 100, ErrorMessage = "Page size can't be more than 100 and less than 1")]
    public int pageSize { get; set; } = 20;

    [Range(0, int.MaxValue)] 
    public int pageCursorId { get; set; } = 0;

    public DateTime pageCursorDate { get; set; } = DateTime.MaxValue;
}