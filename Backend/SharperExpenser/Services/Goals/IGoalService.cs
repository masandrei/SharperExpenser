using SharperExpenser.DataTransferObjects.Goal;
using SharperExpenser.Models;

namespace SharperExpenser.Services.Goals;
public interface IGoalService
{
    IQueryable<Goal> GetAllGoals(int UserId);
    Goal? GetGoal(int UserId, int id);
    void CreateGoal(CreateGoalRequest request, int UserId);
    void UpdateGoal(UpdateGoalRequest request, int UserId);
    void DeleteGoal(int UserId, int Id);
}
