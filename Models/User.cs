namespace MyGameList.Models
{
    public class User
    {
        public int userId { get; set; }

        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!; // hashed password

        public ICollection<UserGame> UserGames { get; set; } = new List<UserGame>();

    }
}
