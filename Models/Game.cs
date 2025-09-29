namespace MyGameList.Models
{
    public class Game
    {
        public int gameId { get; set; }

        public string Title { get; set; } = null!;

        public string? imageUrl { get; set; }

        public string? igdbId { get; set; }

        public ICollection<UserGame> UserGames { get; set; } = new List<UserGame>();

    }
}
