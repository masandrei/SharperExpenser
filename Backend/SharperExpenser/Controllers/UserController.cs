using Microsoft.AspNetCore.Mvc;
using SharperExpenser.Models;
using SharperExpenser.Services.Users;
using SharperExpenser.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using SharperExpenser.DataTransferObjects.User;

namespace SharperExpenser.Controllers;
[ApiController]
[Route("/user")]
public class UserController : ControllerBase
{
    private readonly IUsersService _userService;
    private readonly IAuthService _authService;
    public UserController(IUsersService userService, IAuthService authService)
    {
        _userService = userService;
        _authService = authService;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetUserInfo()
    {
        int UserId = _authService.ValidateToken(HttpContext.Request.Headers["Authorization"].ToString());
        if(UserId == -1)
        {
            return BadRequest();
        }
        var user = _userService.GetUser(UserId);
        if(user == null)
        {
            return NotFound(user);
        }
        var response = new UserResponse(user.Email, user.Main_Currency);
        return Ok(response);
    }

    [HttpPost("register")]
    public IActionResult RegisterUser(CreateUserRequest request)
    {
        var NewUser = new User
            {
                Email = request.Email,
                Password_Hash = request.Password,
                Main_Currency = request.Main_Currency
            };
        try
        {
            _userService.CreateUser(NewUser);
        }
        catch(Exception exc)
        {
            return BadRequest(exc.Message);
        }
        var response = new LoginResponse{
            AccessToken = _authService.GenerateToken(NewUser)
        };
        return CreatedAtAction
        (actionName: nameof(RegisterUser),
        routeValues : new {Id = NewUser.Id},
        value: response);
    }

    [HttpPost("login")]
    public IActionResult LoginUser(LoginUserRequest request)
    {
        User? UserByEmail = _userService.GetUser(request.Email);
        if(UserByEmail == null)
        {
            return NotFound();
        }
        User? validatedUser = _authService.AuthenticateUser(request.Password, UserByEmail);
        if(validatedUser == null)
        {
            return Forbid();
        }

        var response = new LoginResponse
        {
            AccessToken = _authService.GenerateToken(validatedUser)
        };
        return Ok(response);
    }

}