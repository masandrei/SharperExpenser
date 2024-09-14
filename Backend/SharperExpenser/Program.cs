using System.Text;
using Coravel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SharperExpenser.DataBaseContexts;
using SharperExpenser.Helpers;
using SharperExpenser.Helpers.Validation;
using SharperExpenser.Services.Auth;
using SharperExpenser.Services.Goals;
using SharperExpenser.Services.Misc;
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
    builder.Services.AddHttpClient<GetExchangeRatesTask>();
    builder.Services.AddSingleton<ICurrencyService, CurrencyService>();
    builder.Services.AddScoped<IUsersService,UserService>();
    builder.Services.AddScoped<ITransactionService,TransactionService>();
    builder.Services.AddScoped<IGoalService, GoalService>();
    builder.Services.AddTransient<IAuthService, AuthService>();
    builder.Services.AddTransient<GetExchangeRatesTask>();
    builder.Services.AddMvc(opt =>
    {
        opt.Filters.Add<CheckTokenClaimsFilter>();
        opt.Filters.Add<ValidationFilter>();
    });
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(x => 
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
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
               .AllowAnyMethod();
            });
    });
}


var app = builder.Build();
{
    app.Services.UseScheduler(scheduler =>
    {
        scheduler.Schedule<GetExchangeRatesTask>()
        .EveryMinute();
    });
    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseCors("AllowReactApp");
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.Run();
}






