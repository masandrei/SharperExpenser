using SharperExpenser.DataTransferObjects.Goal;
using SharperExpenser.Models;
using SharperExpenser.Services.Interfaces;

namespace SharperExpenser.Services.Goals;
public interface IGoalService : IObserver
{
    IQueryable<Goal> GetAllGoals(int UserId);
    Goal? GetGoal(int UserId, int id);
    Goal? CreateGoal(CreateGoalRequest request, int UserId);
    void UpdateGoal(UpdateGoalRequest request, int UserId);
    void DeleteGoal(int UserId, int Id);
}
