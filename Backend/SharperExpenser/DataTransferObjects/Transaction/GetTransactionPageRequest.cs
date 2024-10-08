﻿using System.ComponentModel.DataAnnotations;

namespace SharperExpenser.DataTransferObjects.Transaction;

public class GetTransactionPageRequest
{
    public int UserId { get; set; }
    [Range(1, 25, ErrorMessage = "Page size can't be more than 100 and less than 1")]
    public int PageSize { get; set; }

    [Range(0, int.MaxValue)] 
    public int PageCursorId { get; set; } = 0;

    public DateTime PageCursorDate { get; set; } = DateTime.MaxValue;
}