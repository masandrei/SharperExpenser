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
        List<Goal> LastByPriority = GetAllGoals(UserId).OrderByDescending(goal => goal.Priority).ToList();
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
            Currency = request.CreateCurrency
        };
        _goalContext.GoalRecords.Add(NewGoal);
        _goalContext.SaveChangesAsync();
        return NewGoal;
    }

    public void DeleteGoal(int UserId, int Id)
    {
        var UserGoals = GetAllGoals(UserId).OrderBy(goal => goal.Priority).ToList();
        if (UserGoals.Count > 0)
        {
            var temp = UserGoals.FindIndex(goal => goal.Id == Id);
            if(temp == -1)
            {
                return;
            }
            if (temp == 0 && UserGoals.Count > 1)
            {
                (UserGoals[1].MoneyStartingPeriod, UserGoals[1].AmountAtTheStartOfMonth, UserGoals[1].AdditionalAmount) = 
                    (UserGoals[0].MoneyStartingPeriod, UserGoals[0].AmountAtTheStartOfMonth, UserGoals[0].AdditionalAmount);
            }
            _goalContext.GoalRecords.Remove(UserGoals[temp]);
            _goalContext.SaveChangesAsync();
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

    public void Update(Transaction? oldTransaction, Transaction? newTransaction)
    {
        Goal? temp = GetAllGoals((oldTransaction?.UserId ?? newTransaction?.UserId) ?? -1).FirstOrDefault();
        if(temp == null 
            || (oldTransaction?.TransactionDate < temp.MoneyStartingPeriod && newTransaction?.TransactionDate < temp.MoneyStartingPeriod)
            || (oldTransaction is null && newTransaction?.TransactionDate < temp.MoneyStartingPeriod)
            || (newTransaction is null && oldTransaction?.TransactionDate < temp.MoneyStartingPeriod))
        {
            return;
        }
    }

    public void UpdateGoal(UpdateGoalRequest request, int UserId)
    {
        Goal? temp = null;
        if (request.UpdatePriority != null)
        {
            List<Goal> UserGoals = GetAllGoals(UserId).OrderBy(goal => goal.Priority).ToList();
            int tempIndex = UserGoals.FindIndex(goal => goal.Id == request.Id);
            if(tempIndex == -1)
            {
                return;
            }
            temp = UserGoals[tempIndex];
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
        else
        {
            temp = GetGoal(UserId, request.Id);
        }
        if(temp == null)
        {
            return;
        }
        temp.GoalName = request.UpdateGoalName ?? temp.GoalName;
        temp.EndDate = request.UpdateEndDate ?? temp.EndDate;
        temp.MoneyToGather = request.UpdateMoneyToGather ?? temp.MoneyToGather;
        temp.Currency = request.UpdateCurrency ?? temp.Currency;
        _goalContext.SaveChangesAsync();
    }
}
