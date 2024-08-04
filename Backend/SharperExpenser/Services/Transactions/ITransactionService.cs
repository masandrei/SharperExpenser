using SharperExpenser.DataTransferObjects;
using SharperExpenser.Models;
using SharperExpenser.Helpers;

namespace SharperExpenser.Services.Transactions;

public interface ITransactionService
{
    void CreateTransaction(Transaction transaction);
    void DeleteTransaction(int Id, int UserId);
    void UpdateTransaction(Transaction transaction);
    Transaction? GetTransaction(int Id, int UserId);
    IQueryable<Transaction> GetUserTransactions(int UserId, FilterRequest filter);
    Dictionary<string, Dictionary<string, decimal>> ReportByCategories(int UserId, FilterRequest filter);
}