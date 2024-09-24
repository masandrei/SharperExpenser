using SharperExpenser.DataBaseContexts;
using SharperExpenser.DataTransferObjects.Goal;
using SharperExpenser.Models;

namespace SharperExpenser.Services.Goals;
public class GoalService : IGoalService
{
    private readonly ApplicationContext _goalContext;
    public GoalService(ApplicationContext applicationContext)
    {
        _goalContext = applicationContext;
    }
    public Goal? CreateGoal(CreateGoalRequest request, int UserId)
    {
        List<Goal> UserGoals = GetAllGoals(UserId).Where(goal => !goal.IsFinished).OrderByDescending(goal => goal.Priority).ToList();
        if(UserGoals.Count == 5)
        {
            return null;
        }
        Goal? LastByPriority = UserGoals.FirstOrDefault();
        Goal NewGoal = new Goal
        {
            UserId = UserId,
            GoalName = request.CreateGoalName,
            MoneyStartingPeriod = DateTime.Now,
            Priority = (LastByPriority?.Priority ?? 0) + 1,
            AmountAtTheStartOfMonth = 0M,
            AdditionalAmount = 0M,
            MoneyToGather = request.CreateMoneyToGather,
            Currency = request.CreateCurrency,
            IsFinished = false
        };
        _goalContext.GoalRecords.Add(NewGoal);
        _goalContext.SaveChanges();
        return NewGoal;
    }

    public void DeleteGoal(int UserId, int Id, decimal ExchangeRate)
    {
        var UserGoals = GetAllGoals(UserId).OrderBy(goal => goal.IsFinished).ThenBy(goal => goal.Priority).ToList();
        if (UserGoals.Count > 0)
        {
            var GoalIndex = UserGoals.FindIndex(goal => goal.Id == Id);
            if(GoalIndex == -1)
            {
                return;
            }
            if (GoalIndex == 0 && UserGoals.Count > 1 && !UserGoals[GoalIndex + 1].IsFinished)
            {
                UserGoals[1].MoneyStartingPeriod = UserGoals[0].MoneyStartingPeriod;
                ( UserGoals[1].AmountAtTheStartOfMonth, UserGoals[1].AdditionalAmount) =
                ( UserGoals[0].AmountAtTheStartOfMonth * ExchangeRate, UserGoals[0].AdditionalAmount * ExchangeRate);
            }
            _goalContext.GoalRecords.Remove(UserGoals[GoalIndex]);
            _goalContext.SaveChanges();
        }
    }

    public IQueryable<Goal> GetAllGoals(int UserId)
    {
        return _goalContext.GoalRecords.Where(goal => goal.UserId == UserId);
    }

    public Goal? GetGoal(int UserId, int id)
    {
        return _goalContext.GoalRecords.FirstOrDefault(goal => goal.UserId == UserId && goal.Id == id);
    }

    public void Update(Transaction? oldTransaction, Transaction? newTransaction, decimal newExchangeRate = 1, decimal oldExchangeRate = 1)
    {
        if (oldTransaction == null && newTransaction == null)
        {
            return;
        }
        int UserId = (oldTransaction?.UserId ?? newTransaction?.UserId) ?? -1;
        List<Goal> UserGoals = GetAllGoals(UserId).Where(goal => !goal.IsFinished).OrderBy(goal => goal.Priority).ToList();
        Goal? temp = UserGoals.FirstOrDefault();
        if(temp == null 
            || (oldTransaction?.TransactionDate < temp.MoneyStartingPeriod && newTransaction?.TransactionDate < temp.MoneyStartingPeriod)
            || (oldTransaction is null && newTransaction?.TransactionDate < temp.MoneyStartingPeriod)
            || (newTransaction is null && oldTransaction?.TransactionDate < temp.MoneyStartingPeriod))
        {
            return;
        }
        Console.WriteLine($"Goal {temp.GoalName} is being updated");
        if((oldTransaction is null || oldTransaction.TransactionDate < temp.MoneyStartingPeriod ) && newTransaction?.TransactionDate >= temp.MoneyStartingPeriod)
        {
            decimal difference = 0;
            difference = newTransaction.Amount * newExchangeRate;

            if(newTransaction.TransactionDate.Year == DateTime.Now.Year && newTransaction.TransactionDate.Month == DateTime.Now.Month)
            {
                temp.AdditionalAmount += difference;
            }
            else
            {
                temp.AmountAtTheStartOfMonth += difference;
            }
        }
        else if((newTransaction is null || newTransaction.TransactionDate < temp.MoneyStartingPeriod ) && oldTransaction?.TransactionDate >= temp.MoneyStartingPeriod)
        {
            decimal difference = 0;
            difference = oldTransaction.Amount * oldExchangeRate;

            if (oldTransaction.TransactionDate.Year == DateTime.Now.Year && oldTransaction.TransactionDate.Month == DateTime.Now.Month)
            {
                temp.AdditionalAmount -= difference;
            }
            else
            {
                temp.AmountAtTheStartOfMonth = Math.Max(0, temp.AmountAtTheStartOfMonth - difference);
            }
        }
        else
        {
            if (oldTransaction != null && oldTransaction.Equals(newTransaction))
            {
                return;
            }
            decimal oldAmountInGoalCurrency = oldTransaction.Amount;
            decimal newAmountInGoalCurrency = newTransaction.Amount;
            if (oldTransaction.Currency != temp.Currency)
            {
                oldAmountInGoalCurrency = oldTransaction.Amount * oldExchangeRate;
            }

            if (newTransaction.Currency != temp.Currency)
            {
                newAmountInGoalCurrency = newTransaction.Amount * newExchangeRate;
            }

            decimal difference = newAmountInGoalCurrency - oldAmountInGoalCurrency;
            if (newTransaction.TransactionDate.Year == DateTime.Now.Year && newTransaction.TransactionDate.Month == DateTime.Now.Month)
            {
                temp.AdditionalAmount += difference;
            }
            else
            {
                temp.AmountAtTheStartOfMonth = Math.Max(0, temp.AmountAtTheStartOfMonth + difference);
            }
        }
        _goalContext.SaveChanges();
    }

    public void UpdateGoal(UpdateGoalRequest request, int UserId)
    {
        List<Goal> UserGoals = GetAllGoals(UserId).Where(goal => !goal.IsFinished).OrderBy(goal => goal.Priority).ToList();
        int GoalIndex = UserGoals.FindIndex(goal => goal.Id == request.Id);
        if (GoalIndex == -1)
        {
            return;
        }
        Goal temp = UserGoals[GoalIndex];
        if (request.UpdatePriority != null)
        {
            int highestPriority = UserGoals[^1].Priority;
            int lowestPriority = UserGoals[0].Priority;
            if(request.UpdatePriority >= highestPriority)
            {
                Console.WriteLine("Highest");
                temp.Priority = highestPriority + 1;
            }
            else if(request.UpdatePriority <= lowestPriority)
            {
                Console.WriteLine("Lowest");
                temp.Priority = lowestPriority - 1;
                temp.AmountAtTheStartOfMonth = UserGoals[0].AmountAtTheStartOfMonth * (request.ExchangeRate ?? 1);
                temp.AdditionalAmount = UserGoals[0].AdditionalAmount * (request.ExchangeRate ?? 1);
                temp.MoneyStartingPeriod = UserGoals[0].MoneyStartingPeriod;
            }
            else
            {
                Console.WriteLine("Neither");
                if(GoalIndex == 0)
                {
                    (temp.AmountAtTheStartOfMonth, UserGoals[1].AmountAtTheStartOfMonth) = (0, temp.AmountAtTheStartOfMonth * (request.ExchangeRate ?? 1));
                    (temp.AdditionalAmount, UserGoals[1].AdditionalAmount) = (0, temp.AdditionalAmount * (request.ExchangeRate ?? 1));
                    UserGoals[1].MoneyStartingPeriod = temp.MoneyStartingPeriod;
                }
                while (GoalIndex + 1 < UserGoals.Count && temp.Priority < request.UpdatePriority)
                {
                    Console.WriteLine($"{temp.GoalName} is being decreased, {UserGoals[GoalIndex + 1].GoalName} is being increased");
                    (temp.Priority, UserGoals[GoalIndex + 1].Priority) = 
                        (UserGoals[GoalIndex + 1].Priority, temp.Priority);
                    GoalIndex++;
                }
                while (GoalIndex > 0 && temp.Priority > request.UpdatePriority)
                {
                    Console.WriteLine($"{temp.GoalName} is being increased, {UserGoals[GoalIndex - 1].GoalName} is being decreased");
                    (temp.Priority, UserGoals[GoalIndex - 1].Priority) = 
                        (UserGoals[GoalIndex - 1].Priority, temp.Priority);
                    GoalIndex--;
                }
            }
        }
        temp.GoalName = request.UpdateGoalName ?? temp.GoalName;
        temp.MoneyToGather = request.UpdateMoneyToGather ?? temp.MoneyToGather;
        temp.Currency = request.UpdateCurrency ?? temp.Currency;
        _goalContext.SaveChanges();
    }

    public void FinishGoal(int UserId, int GoalId, decimal ExchangeRate)
    {
        List<Goal> UserGoals = GetAllGoals(UserId).Where(goal => !goal.IsFinished).OrderBy(goal => goal.Priority).Take(2).ToList();
        Goal? firstByPriority = UserGoals.FirstOrDefault();
        if (firstByPriority is null || UserGoals[0].Id != GoalId)
        {
            return;
        }
        decimal sum = firstByPriority.AmountAtTheStartOfMonth + firstByPriority.AdditionalAmount;
        if(sum < firstByPriority.MoneyToGather)
        {
            return;
        }
        firstByPriority.IsFinished = true;
        firstByPriority.AdditionalAmount = 0M;
        firstByPriority.AmountAtTheStartOfMonth = firstByPriority.MoneyToGather;
        if (UserGoals.Count > 1)
        {
            UserGoals[1].AdditionalAmount = (sum - firstByPriority.MoneyToGather) * ExchangeRate;
        }
        _goalContext.SaveChanges();
    }
}
