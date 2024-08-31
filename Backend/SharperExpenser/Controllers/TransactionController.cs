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
    private readonly IAuthService _authService;

    public TransactionController(IAuthService authService, ITransactionService transactionService)
    {
        _authService = authService;
        _transactionService = transactionService;
    }
    [HttpGet]
    public IActionResult GetTransactionPage([FromQuery] FilterRequest filter, [FromQuery] GetTransactionPageRequest pageRequest)
    {
        int UserId = _authService.ValidateToken(HttpContext.Request.Headers["Authorization"].ToString());
        if(UserId == -1)
        {
            return Unauthorized();
        }
        var transactions = _transactionService.GetUserTransactions(UserId, filter)
            .OrderByDescending(transaction => transaction.TransactionDate)
            .ThenBy(transaction => transaction.Id)
            .Where(transaction => transaction.TransactionDate < pageRequest.pageCursorDate || (transaction.TransactionDate == pageRequest.pageCursorDate && transaction.Id > pageRequest.pageCursorId))
            .Take(pageRequest.pageSize)
            .GroupBy(transaction => transaction.TransactionDate.Date)
            .ToList();
        (DateTime newCursorDate, int newCursorId) = transactions.Any()
            ? (transactions[0].First().TransactionDate, transactions[0].First().Id)
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
    public IActionResult GetReportByCategories([FromQuery] FilterRequest filter)
    {
        int UserId = _authService.ValidateToken(HttpContext.Request.Headers["Authorization"].ToString());
        if(UserId == -1)
        {
            return Unauthorized();
        }

        var transactions = _transactionService.ReportByCategories(UserId, filter);
        return Ok(transactions);
    }

    [HttpGet("currencies")]
    public IActionResult GetUserCurrencies([FromQuery] FilterRequest filter)
    {
        int UserId = _authService.ValidateToken(HttpContext.Request.Headers["Authorization"].ToString());
        if(UserId == -1)
        {
            return Unauthorized();
        }

        var currencies = _transactionService.GetUserTransactions(UserId, filter).Select(x => x.Currency).ToHashSet();
        return Ok(currencies);
    }
    [HttpGet("{id}")]
    public IActionResult GetTransaction(int id)
    {
        int UserId = _authService.ValidateToken(HttpContext.Request.Headers["Authorization"].ToString());
        if(UserId == -1)
        {
            return Unauthorized();
        }
        Transaction? transaction = _transactionService.GetTransaction(id, UserId);
        if(transaction == null)
        {
            return NotFound();
        }
        return Ok(transaction);
    }
    [HttpPost]
    public IActionResult CreateTransaction([FromBody]CreateTransactionRequest request)
    {
        int UserId = _authService.ValidateToken(HttpContext.Request.Headers["Authorization"].ToString());
        if(UserId == -1)
        {
            return BadRequest();
        }
        Transaction temp = new Transaction
        {
            UserId = UserId,
            Amount = request.TransactionAmount,
            Category = request.TransactionCategory,
            Currency = request.TransactionCurrency,
            TransactionDate = request.TransactionDate
        };
        _transactionService.CreateTransaction(temp);
        return CreatedAtAction(
            actionName : nameof(CreateTransaction),
            routeValues: new {Id = temp.Id},
            value : temp
        );
    }

    [HttpDelete]
    public IActionResult DeleteTransaction([FromBody]DeleteTransactionRequest request)
    {
        int UserId = _authService.ValidateToken(HttpContext.Request.Headers["Authorization"].ToString());
        if(UserId == -1)
        {
            return BadRequest();
        }
        _transactionService.DeleteTransaction(request.TransactionId, UserId);
        return Ok();
    }

    [HttpPut]
    public IActionResult UpsertTransaction([FromBody]UpsertTransactionRequest request)
    {
        int UserId = _authService.ValidateToken(HttpContext.Request.Headers["Authorization"].ToString());
        if(UserId == -1)
        {
            return BadRequest();
        }
        Transaction temp = new Transaction
        {
            UserId = UserId,
            Id = request.id,
            Amount = request.amount,
            Currency = request.currency,
            Category = request.category,
            TransactionDate = request.transactionDate
        };
        _transactionService.UpdateTransaction(temp);
        return Ok();
    }
}