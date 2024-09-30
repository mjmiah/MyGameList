namespace MyGameList.Models
{
    public class GameItem
    {
        public int GameId { get; set; }

        public string Title { get; set; } = null!;

        public string ImageLink { get; set; } = null!;

        public string Genre { get; set; } = null!;

        public string Platforms { get; set; } = null!;

        public int IgdbId { get; set; }
    }
}
}
