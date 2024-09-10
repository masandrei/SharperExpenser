using Microsoft.AspNetCore.Mvc;
using SharperExpenser.Models;
using SharperExpenser.Services.Auth;
using SharperExpenser.Services.Transactions;
using Microsoft.AspNetCore.Authorization;
using SharperExpenser.DataTransferObjects;
using SharperExpenser.DataTransferObjects.Transaction;

namespace SharperExpenser.Controllers;

[Authorize]
[ApiController]
[Route("/transaction")]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionController(IAuthService authService, ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }
    [HttpGet]
    public IActionResult GetTransactionPage([FromQuery] FilterRequest filter, [FromQuery] GetTransactionPageRequest pageRequest)
    {
        var transactions = _transactionService.GetUserTransactions(pageRequest.UserId, filter)
        .Where(transaction => transaction.TransactionDate < pageRequest.pageCursorDate ||
          (transaction.TransactionDate == pageRequest.pageCursorDate && transaction.Id > pageRequest.pageCursorId))
        .OrderByDescending(transaction => transaction.TransactionDate)
        .ThenBy(transaction => transaction.Id)
        .Take(pageRequest.pageSize)
        .ToList()
        .GroupBy(transaction => transaction.TransactionDate.Date)
        .Select(g => g.OrderByDescending(t => t.TransactionDate).ThenBy(t => t.Id).ToList())
        .ToList();
        (DateTime newCursorDate, int newCursorId) = transactions.Any()
            ? (transactions.Last().Last().TransactionDate, transactions.Last().Last().Id)
            : (DateTime.UnixEpoch, int.MaxValue);

        var pageResponse = new GetTransactionPageResponse
        {
            nextPageCursorDate = newCursorDate,
            transactionPage = transactions,
            nextPageCursorId = newCursorId
        };
        return Ok(pageResponse);
    }

    [HttpGet("report")]
    public IActionResult GetReportByCategories([FromQuery] FilterRequest filter, [FromQuery] int UserId)
    {
        var transactions = _transactionService.ReportByCategories(UserId, filter);
        return Ok(transactions);
    }

    [HttpGet("currencies")]
    public IActionResult GetUserCurrencies([FromQuery] FilterRequest filter, [FromQuery] int UserId)
    {
        var currencies = _transactionService.GetUserTransactions(UserId, filter).Select(x => x.Currency).ToHashSet();
        return Ok(currencies);
    }
    [HttpGet("categories")]
    public IActionResult GetUserCategories([FromQuery] FilterRequest filter, [FromQuery] int UserId)
    {
        var currencies = _transactionService.GetUserTransactions(UserId, filter).Select(x => x.Category).ToHashSet();
        return Ok(currencies);
    }
    [HttpGet("{id}")]
    public IActionResult GetTransaction(int id, [FromQuery] int UserId)
    {
        Transaction? transaction = _transactionService.GetTransaction(id, UserId);
        if(transaction == null)
        {
            return NotFound();
        }
        return Ok(transaction);
    }
    [HttpPost]
    public IActionResult CreateTransaction([FromBody]CreateTransactionRequest request, [FromQuery] int UserId)
    {
        Transaction temp = _transactionService.CreateTransaction(request, UserId);
        return CreatedAtAction(
            nameof(CreateTransaction),
            temp
        );
    }

    [HttpDelete]
    public IActionResult DeleteTransaction([FromBody]DeleteTransactionRequest request, [FromQuery] int UserId)
    {
        _transactionService.DeleteTransaction(request.TransactionId, UserId);
        return Ok();
    }

    [HttpPut]
    public IActionResult UpsertTransaction([FromBody]UpsertTransactionRequest request, [FromQuery] int UserId)
    {
        
        Transaction? temp = _transactionService.UpdateTransaction(request, UserId);
        if(temp == null)
        {
            return BadRequest("Transaction does not exist");
        }
        return Ok(temp);
    }
}