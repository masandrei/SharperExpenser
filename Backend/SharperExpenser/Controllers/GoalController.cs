using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharperExpenser.Helpers;

namespace SharperExpenser.Controllers;
[Authorize]
[ApiController]
[CheckTokenClaimsFilter]
[Route("goal")]
public class GoalController : ControllerBase
{
    [HttpGet]
    public Task<IActionResult> GetGoals([FromQuery] int UserId)
    {

    }
}
