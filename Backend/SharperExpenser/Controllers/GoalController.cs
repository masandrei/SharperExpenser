using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharperExpenser.DataTransferObjects.Goal;
using SharperExpenser.Models;
using SharperExpenser.Services.Goals;

namespace SharperExpenser.Controllers;
[Authorize]
[ApiController]
[Route("goals")]
public class GoalController : ControllerBase
{
    private readonly IGoalService _goalService;
    public GoalController(IGoalService goalService)
    {
        _goalService = goalService;
    }
    [HttpGet]
    public IActionResult GetGoals([FromQuery] int UserId)
    {
        List<Goal> temp = _goalService.GetAllGoals(UserId).OrderBy(goal => goal.Priority).ToList();
        return Ok(temp);
    }
    [HttpGet("{id}")]
    public IActionResult GetGoalById(int id, [FromQuery]int UserId)
    {
        Goal? temp = _goalService.GetGoal(UserId, id);
        if(temp == null)
        {
            return NotFound();
        }
        return Ok(temp);
    }
    [HttpPost]
    public IActionResult CreateNewGoal([FromBody] CreateGoalRequest request, [FromQuery] int UserId)
    {
        Goal? temp = _goalService.CreateGoal(request, UserId);
        if(temp == null)
        {
            return BadRequest("Limit of available goals has been exceeded");
        }
        return CreatedAtAction(nameof(CreateNewGoal),
            temp);
    }
    [HttpDelete]
    public IActionResult DeleteGoal([FromQuery] int UserId, [FromBody] DeleteGoalRequest request)
    {
        _goalService.DeleteGoal(UserId, request.Id, request.ExchangeRate);
        return Ok();
    }
    [HttpPut]
    public IActionResult UpdateGoal([FromQuery] int UserId, [FromBody] UpdateGoalRequest request)
    {
        _goalService.UpdateGoal(request, UserId);
        return Ok();
    }
    [HttpPut("finish")]
    public IActionResult FinishGoal([FromQuery] int UserId, [FromBody] FinishGoalRequest request)
    {
        _goalService.FinishGoal(UserId, request.Id, request.ExchangeRate);
        return Ok();
    }
}
