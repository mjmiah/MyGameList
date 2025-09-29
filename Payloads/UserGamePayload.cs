namespace MyGameList.Payloads
{
    public class UserGamePayload
    {
        public int gameId { get; set; }
        public int Rating { get; set; }
        public string Title { get; set; } = null!;
        public string? imageUrl { get; set; }
        public string igdbId { get; set; } = null!;
    }
}
