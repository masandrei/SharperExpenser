using SharperExpenser.DataTransferObjects;
using SharperExpenser.Models;
using SharperExpenser.Helpers;
using SharperExpenser.DataTransferObjects.Transaction;

namespace SharperExpenser.Services.Transactions;

public interface ITransactionService
{
    Transaction CreateTransaction(CreateTransactionRequest request, int UserId);
    void DeleteTransaction(DeleteTransactionRequest request, int UserId);
    Transaction UpdateTransaction(UpsertTransactionRequest request, int UserId);
    Transaction? GetTransaction(int Id, int UserId);
    IQueryable<Transaction> GetUserTransactions(int UserId, FilterRequest filter);
    Dictionary<string, Dictionary<string, decimal>> ReportByCategories(int UserId, FilterRequest filter);
}