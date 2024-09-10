using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharperExpenser.DataTransferObjects.Goal;
using SharperExpenser.Models;
using SharperExpenser.Services.Goals;

namespace SharperExpenser.Controllers;
[Authorize]
[ApiController]
[Route("goal")]
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
        List<Goal> temp = _goalService.GetAllGoals(UserId).ToList();
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
    public IActionResult DeleteGoal([FromQuery] int UserId, [FromQuery] int Id)
    {
        _goalService.DeleteGoal(UserId, Id);
        return Ok();
    }
    [HttpPut]
    public IActionResult UpdateGoal([FromQuery] int UserId, [FromBody] UpdateGoalRequest request)
    {
        _goalService.UpdateGoal(request, UserId);
        return Ok();
    }

}
