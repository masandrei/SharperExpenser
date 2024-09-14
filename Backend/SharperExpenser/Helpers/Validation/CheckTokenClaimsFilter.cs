using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.WebUtilities;
using SharperExpenser.DataTransferObjects.Transaction;
using SharperExpenser.Services.Auth;
using System.Net;
using System.Text.Json;

namespace SharperExpenser.Helpers.Validation;

public class CheckTokenClaimsFilter : Attribute, IAsyncResourceFilter
{
    private IAuthService? _authService = null;

    public async Task OnResourceExecutionAsync(ResourceExecutingContext context, ResourceExecutionDelegate next)
    {
        _authService = context.HttpContext.RequestServices.GetService<IAuthService>();
        var UserId = _authService.ValidateToken(context.HttpContext.Request.Headers.Authorization);
        if (UserId == string.Empty)
        {
            context.Result = new UnauthorizedResult();
        }
        IDictionary<string, string?> query = context.HttpContext.Request.Query.ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());
        query["userId"] = UserId;

        var newQueryString = QueryHelpers.AddQueryString(string.Empty, query);
        context.HttpContext.Request.QueryString = new QueryString(newQueryString);

        await next();
    }
}
