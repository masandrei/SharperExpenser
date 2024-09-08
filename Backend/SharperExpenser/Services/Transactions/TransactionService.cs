using SharperExpenser.DataBaseContexts;
using SharperExpenser.DataTransferObjects;
using SharperExpenser.Models;

namespace SharperExpenser.Services.Transactions;

public class TransactionService : ITransactionService
{
    private readonly ApplicationContext _transactionContext;
    public TransactionService(ApplicationContext transactionContext)
    {
        _transactionContext = transactionContext;
    }
    public void CreateTransaction(Transaction transaction)
    {
        _transactionContext.TransactionRecords.Add(transaction);
        _transactionContext.SaveChangesAsync();
    }

    public void DeleteTransaction(int id, int userId)
    {
        Transaction? transaction = _transactionContext.TransactionRecords.FirstOrDefault(transactions => transactions.UserId == userId && transactions.Id == id);
        if (transaction != null)
        {
            _transactionContext.TransactionRecords.Remove(transaction);
            _transactionContext.SaveChangesAsync();
        }
    }

    public void UpdateTransaction(Transaction transaction)
    {
        Transaction? temp = _transactionContext.TransactionRecords.Find(transaction.Id);
        if(temp == null)
        {
            CreateTransaction(transaction);
            return;
        }
        _transactionContext.Entry(temp).CurrentValues.SetValues(transaction);
        _transactionContext.SaveChanges();
    }

    public Transaction? GetTransaction(int id, int userId)
    {
        return _transactionContext.TransactionRecords.FirstOrDefault(transaction =>
            transaction.UserId == userId && transaction.Id == id);
    }
    public IQueryable<Transaction> GetUserTransactions(int userId, FilterRequest filter)
    {
        Console.WriteLine(filter.Currency);
        var temp = _transactionContext.TransactionRecords.Where(x => x.UserId == userId);
        if (filter.Category != null)
        {
            var categorySet = filter.Category.Split(",").ToHashSet();
            temp = temp.Where(x => categorySet.Contains(x.Category));
        }

        if (filter.Currency != null)
        {
            var currencySet = filter.Currency.Split(",").ToHashSet();
            temp = temp.Where(x => currencySet.Contains(x.Currency));
        }

        if (filter.AmountFrom != null)
        {
            temp = temp.Where(x => Math.Abs(x.Amount) >= filter.AmountFrom);
        }
        if (filter.AmountTo != null)
        {
            temp = temp.Where(x => Math.Abs(x.Amount) <= filter.AmountTo);
        }
        
        if (filter.DateFrom != null)
        {
            temp = temp.Where(x => x.TransactionDate >= filter.DateFrom);
        }
        if (filter.DateTo != null)
        {
            temp = temp.Where(x => x.TransactionDate <= filter.DateTo);
        }

        return temp;
    }

    public Dictionary<string, Dictionary<string, decimal>> ReportByCategories(int userId,
        FilterRequest filter)
    {
        var temp = GetUserTransactions(userId, filter);
        var expensesQuery = temp.Where(transaction => transaction.Amount < 0);
        var totalExpenses = expensesQuery.Sum(transaction => transaction.Amount);
        var expensesByCategory = expensesQuery
            .GroupBy(transaction => transaction.Category)
            .Select(category => new {Category = category.Key, Sum = category.Sum(transaction => transaction.Amount) })
            .ToDictionary(g => g.Category, g => g.Sum);
        expensesByCategory.Add("total",totalExpenses);
        var incomesQuery = temp.Where(transaction => transaction.Amount > 0);
        var totalIncomes = incomesQuery.Sum(transaction => transaction.Amount);
        var incomesByCategory = incomesQuery
            .GroupBy(transaction => transaction.Category)
            .Select(category => new { Category = category.Key, Sum = category.Sum(transaction => transaction.Amount) })
            .ToDictionary(g => g.Category, g => g.Sum);
        incomesByCategory.Add("total", totalIncomes);
        Dictionary<string, Dictionary<string, decimal>> result = new Dictionary<string, Dictionary<string, decimal>>
        {
            { "expenses", expensesByCategory },
            { "incomes", incomesByCategory }
        };
        return result;
    }
}