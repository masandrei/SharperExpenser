using SharperExpenser.DataBaseContexts;
using SharperExpenser.DataTransferObjects.Goal;
using SharperExpenser.Models;
using SharperExpenser.Services.Misc;

namespace SharperExpenser.Services.Goals;
public class GoalService : IGoalService
{
    private readonly ApplicationContext _goalContext;
    private readonly ICurrencyService _currencyService;
    public GoalService(ApplicationContext applicationContext, ICurrencyService currencyService)
    {
        _goalContext = applicationContext;
        _currencyService = currencyService;
    }
    public Goal? CreateGoal(CreateGoalRequest request, int UserId)
    {
        List<Goal> LastByPriority = GetAllGoals(UserId).Where(goal => !goal.IsFinished).OrderByDescending(goal => goal.Priority).ToList();
        if(LastByPriority.Count == 5)
        {
            return null;
        }
        Goal NewGoal = new Goal
        {
            UserId = UserId,
            GoalName = request.CreateGoalName,
            MoneyStartingPeriod = DateTime.Now,
            EndDate = request.CreateEndDate,
            Priority = (LastByPriority.FirstOrDefault()?.Priority ?? int.MinValue) + 1,
            AmountAtTheStartOfMonth = 0M,
            AdditionalAmount = 0M,
            MoneyToGather = request.CreateMoneyToGather,
            Currency = request.CreateCurrency,
            IsFinished = false
        };
        _goalContext.GoalRecords.Add(NewGoal);
        _goalContext.SaveChangesAsync();
        return NewGoal;
    }

    public async void DeleteGoal(int UserId, int Id)
    {
        var UserGoals = GetAllGoals(UserId).OrderBy(goal => goal.Priority).ToList();
        if (UserGoals.Count > 0)
        {
            var temp = UserGoals.FindIndex(goal => goal.Id == Id);
            if(temp == -1)
            {
                return;
            }
            if (temp == 0 && !UserGoals[temp].IsFinished && UserGoals.Count > 1)
            {
                UserGoals[1].MoneyStartingPeriod = UserGoals[0].MoneyStartingPeriod;
                decimal exchangeRate = await _currencyService.GetExchangeRate(DateTime.Today, UserGoals[0].Currency, UserGoals[1].Currency);
                ( UserGoals[1].AmountAtTheStartOfMonth, UserGoals[1].AdditionalAmount) =
                ( UserGoals[0].AmountAtTheStartOfMonth * exchangeRate, UserGoals[0].AdditionalAmount * exchangeRate);
            }
            _goalContext.GoalRecords.Remove(UserGoals[temp]);
            FinishGoal(UserGoals);
            await _goalContext.SaveChangesAsync();
        }
    }

    public IQueryable<Goal> GetAllGoals(int UserId)
    {
        return _goalContext.GoalRecords.Where(goal => goal.UserId == UserId).OrderBy(goal => goal.Priority);
    }

    public Goal? GetGoal(int UserId, int id)
    {
        return _goalContext.GoalRecords.FirstOrDefault(goal => goal.UserId == UserId && goal.Id == id);
    }

    public async void Update(Transaction? oldTransaction, Transaction? newTransaction)
    {
        if (oldTransaction == null && newTransaction == null)
        {
            return;
        }
        int UserId = (oldTransaction?.UserId ?? newTransaction?.UserId) ?? -1;
        List<Goal> UserGoals = GetAllGoals(UserId).Where(goal => !goal.IsFinished).ToList();
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
            if(newTransaction.Currency == temp.Currency)
            {
                difference = newTransaction.Amount;
            }
            else
            {
                decimal exchangeRate = await _currencyService.GetExchangeRate(newTransaction.TransactionDate, newTransaction.Currency, temp.Currency);
                difference = newTransaction.Amount * exchangeRate;
            }

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
            if (oldTransaction.Currency == temp.Currency)
            {
                difference = oldTransaction.Amount;
            }
            else
            {
                decimal exchangeRate = await _currencyService.GetExchangeRate(oldTransaction.TransactionDate, oldTransaction.Currency, temp.Currency);
                difference = oldTransaction.Amount * exchangeRate;
            }

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
            if (oldTransaction.Equals(newTransaction))
            {
                return;
            }
            decimal oldAmountInGoalCurrency = oldTransaction.Amount;
            decimal newAmountInGoalCurrency = newTransaction.Amount;
            if (oldTransaction.Currency != temp.Currency)
            {
                decimal oldExchangeRate = await _currencyService.GetExchangeRate(oldTransaction.TransactionDate, oldTransaction.Currency, temp.Currency);
                oldAmountInGoalCurrency = oldTransaction.Amount * oldExchangeRate;
            }

            if (newTransaction.Currency != temp.Currency)
            {
                decimal newExchangeRate = await _currencyService.GetExchangeRate(newTransaction.TransactionDate, newTransaction.Currency, temp.Currency);
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
        FinishGoal(UserGoals);
        await _goalContext.SaveChangesAsync();
    }

    public void UpdateGoal(UpdateGoalRequest request, int UserId)
    {
        List<Goal> UserGoals = GetAllGoals(UserId).OrderBy(goal => goal.Priority).ToList();
        int tempIndex = UserGoals.FindIndex(goal => goal.Id == request.Id);
        if (tempIndex == -1)
        {
            return;
        }
        Goal temp = UserGoals[tempIndex];
        if (request.UpdatePriority != null)
        {
            
            int highestPriority = UserGoals[^1].Priority;
            int lowestPriority = UserGoals[0].Priority;
            if(request.UpdatePriority > highestPriority)
            {
                temp.Priority = highestPriority + 1;
            }
            else if(request.UpdatePriority < lowestPriority)
            {
                temp.Priority = lowestPriority - 1;
                temp.AmountAtTheStartOfMonth = UserGoals[0].AmountAtTheStartOfMonth;
                temp.AdditionalAmount = UserGoals[0].AdditionalAmount;
                temp.MoneyStartingPeriod = UserGoals[0].MoneyStartingPeriod;
            }
            else
            {
                while(tempIndex + 1 < UserGoals.Count && request.UpdatePriority > UserGoals[tempIndex + 1].Priority)
                {
                    (UserGoals[tempIndex].Priority, UserGoals[tempIndex + 1].Priority) = 
                        (UserGoals[tempIndex + 1].Priority, UserGoals[tempIndex].Priority);
                    tempIndex++;
                }
                while (tempIndex - 1 >= 0 && UserGoals[tempIndex].Priority < UserGoals[tempIndex - 1].Priority)
                {
                    (UserGoals[tempIndex].Priority, UserGoals[tempIndex - 1].Priority) = 
                        (UserGoals[tempIndex - 1].Priority, UserGoals[tempIndex].Priority);
                    tempIndex--;
                }
            }
        }
        temp.GoalName = request.UpdateGoalName ?? temp.GoalName;
        temp.EndDate = request.UpdateEndDate ?? temp.EndDate;
        temp.MoneyToGather = request.UpdateMoneyToGather ?? temp.MoneyToGather;
        temp.Currency = request.UpdateCurrency ?? temp.Currency;
        FinishGoal(UserGoals);
        _goalContext.SaveChangesAsync();
    }

    private async void FinishGoal(List<Goal> UserGoals)
    {
        if(UserGoals.Count == 0)
        {
            return;
        }
        decimal sum = UserGoals[0].AmountAtTheStartOfMonth + UserGoals[0].AdditionalAmount;
        string currency = UserGoals[0].Currency;
        int index = 0;
        for(int i = 0; i <  UserGoals.Count; i++)
        {
            Goal temp = UserGoals[index];
            if(temp.Currency != currency)
            {
                sum *= await _currencyService.GetExchangeRate(DateTime.Today, currency, temp.Currency);
                currency = temp.Currency;
                if(sum < temp.MoneyToGather)
                {
                    break;
                }
            }
            temp.AmountAtTheStartOfMonth = temp.MoneyToGather;
            temp.AdditionalAmount = 0;
            sum -= temp.MoneyToGather;
            temp.IsFinished = true;
            index++;
        }
        if(index != 0 && index < UserGoals.Count)
        {
            UserGoals[index].AdditionalAmount = sum;
        }
    }
}
