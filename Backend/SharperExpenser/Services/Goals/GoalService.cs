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
    public void CreateGoal(CreateGoalRequest request, int UserId)
    {
        List<Goal> LastByPriority = GetAllGoals(UserId).OrderByDescending(goal => goal.Priority).ToList();
        if(LastByPriority.Count == 5)
        {
            return;
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
