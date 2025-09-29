using Microsoft.EntityFrameworkCore;
using MyGameList.Models;

namespace MyGameList
{
    public class AppDbContext : DbContext
    {
        public IConfiguration _config { get; set; }

        public AppDbContext(IConfiguration config)
        {
            _config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Use SQL Server with the connection string from appsettings.json
            optionsBuilder.UseSqlServer(_config.GetConnectionString("DatabaseConnection"));
        }

        // DbSets for Users, Games, and UserGames
        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<UserGame> UserGames { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Composite key for UserGame (userId + gameId)
            modelBuilder.Entity<UserGame>()
                .HasKey(ug => new { ug.userId, ug.gameId });

            // Relationship between User and UserGame
            modelBuilder.Entity<UserGame>()
                .HasOne<User>()   
                .WithMany()       // User can have many UserGames
                .HasForeignKey(ug => ug.userId);

            // Relationship between Game and UserGame
            modelBuilder.Entity<UserGame>()
                .HasOne<Game>()   
                .WithMany()       // Game can have many UserGames
                .HasForeignKey(ug => ug.gameId);
        }
    }
}