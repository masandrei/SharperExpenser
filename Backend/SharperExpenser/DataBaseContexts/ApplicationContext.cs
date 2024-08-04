using Microsoft.EntityFrameworkCore;
using SharperExpenser.Models;

namespace SharperExpenser.DataBaseContexts;

public class ApplicationContext : DbContext
{
    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {}

    public DbSet<User> UserRecords { get; set;} = null!;
    public DbSet<Transaction> TransactionRecords { get; set; } = null!;
}