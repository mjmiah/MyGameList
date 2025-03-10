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
            optionsBuilder.UseSqlServer(_config.GetConnectionString("DatabaseConnection"));
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<UserGame> UserGames { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserGame>()
                .HasKey(ug => new { ug.userId, ug.gameId });  // composite key for UserGame (userId + gameId)

            modelBuilder.Entity<UserGame>()
                .HasOne<User>()  // relationship between User and UserGame
                .WithMany()  // User can have many UserGames
                .HasForeignKey(ug => ug.userId);

            modelBuilder.Entity<UserGame>()
                .HasOne<Game>()  // relationship between Game and UserGame
                .WithMany()  // Game can have many UserGames
                .HasForeignKey(ug => ug.gameId);
        }
    }
}