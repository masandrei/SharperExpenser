using k8s.KubeConfigModels;
using SharperExpenser.DataBaseContexts;
using SharperExpenser.DataTransferObjects;
using SharperExpenser.DataTransferObjects.Transaction;
using SharperExpenser.Models;
using SharperExpenser.Services.Goals;
using SharperExpenser.Services.Interfaces;

namespace SharperExpenser.Services.Transactions;

public class TransactionService : ITransactionService, ISubject
{
    private readonly List<IObserver> observers;
    private readonly ApplicationContext _transactionContext;
    public TransactionService(ApplicationContext transactionContext, IGoalService goalService)
    {
        _transactionContext = transactionContext;
        observers = new List<IObserver>();
        Attach(goalService);
    }
    public Transaction CreateTransaction(CreateTransactionRequest request, int UserId)
    {
        Transaction temp = new Transaction
        {
            UserId = UserId,
            Amount = request.TransactionAmount,
            Category = request.TransactionCategory,
            Currency = request.TransactionCurrency,
            TransactionDate = request.TransactionDate
        };
        _transactionContext.TransactionRecords.Add(temp);
        _transactionContext.SaveChanges();
        Notify(null, temp);
        return temp;
    }

    public void DeleteTransaction(int id, int userId)
    {
        Transaction? transaction = _transactionContext.TransactionRecords.FirstOrDefault(transactions => transactions.UserId == userId && transactions.Id == id);
        if (transaction != null)
        {
            _transactionContext.TransactionRecords.Remove(transaction);
            _transactionContext.SaveChanges();
            Notify(transaction, null);
        }
    }

    public Transaction UpdateTransaction(UpsertTransactionRequest request, int UserId)
    {
        Transaction? temp = _transactionContext.TransactionRecords.FirstOrDefault(transaction => transaction.UserId == UserId && request.Id == transaction.Id);
        if(temp == null)
        {
            return null;
        }
        Transaction newTransaction = new Transaction
        {
            Id = temp.Id,
            UserId = UserId,
            TransactionDate = request.TransactionDate ?? temp.TransactionDate,
            Amount = request.Amount ?? temp.Amount,
            Category = request.Category ?? temp.Category,
            Currency = temp.Currency,
        };
        _transactionContext.Entry(temp).CurrentValues.SetValues(newTransaction);
        _transactionContext.SaveChanges();
        Notify(temp, newTransaction);
        return newTransaction;
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

    public void Attach(IObserver observer)
    {
        observers.Add(observer);
    }

    public void Detach(IObserver observer)
    {
        observers.Remove(observer);
    }

    public void Notify(Transaction? oldTransaction, Transaction? newTransaction)
    {
        foreach(var observer in observers)
        {
            observer.Update(oldTransaction, newTransaction);
        }
    }
}