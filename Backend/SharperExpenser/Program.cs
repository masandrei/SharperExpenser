using System.Net.Http.Headers;
using System.Text;
using Coravel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SharperExpenser.DataBaseContexts;
using SharperExpenser.Helpers;
using SharperExpenser.Helpers.Validation;
using SharperExpenser.Services.Auth;
using SharperExpenser.Services.Goals;
using SharperExpenser.Services.Transactions;
using SharperExpenser.Services.Users;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddControllers();
    AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    builder.Services.AddDbContext<ApplicationContext>(options => 
            options.UseNpgsql("Host=localhost;Port=5432;Database=SharperExpenserDb;Username=postgres;Password=TankiTop4ik;")
            );
    builder.Services.AddScheduler();
    builder.Services.AddScoped<IUsersService,UserService>();
    builder.Services.AddScoped<ITransactionService,TransactionService>();
    builder.Services.AddScoped<IGoalService, GoalService>();
    builder.Services.AddTransient<IAuthService, AuthService>();
    builder.Services.AddMvc(opt =>
    {
        opt.Filters.Add<ValidationFilter>();
    });
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(x => 
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["access_token"];
                    return Task.CompletedTask;
                }
            };
            x.TokenValidationParameters = new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AuthSettings.PrivateKey)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };
        });
    builder.Services.AddAuthorization();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp",
            builder =>
            {
                builder.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
            });
    });
    builder.Services.AddHttpLogging(options => 
    {
        options.LoggingFields = HttpLoggingFields.All;
        options.RequestHeaders.Add("Referer");
        options.ResponseHeaders.Add("MyResponseHeader");
    });
}


var app = builder.Build();
{
    //app.Services.UseScheduler(scheduler =>
    //{
    //    scheduler.Schedule<GetExchangeRatesTask>()
    //    .Monthly();
    //});
    app.UseHttpLogging();
    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseCors("AllowReactApp");
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.Run();
}






