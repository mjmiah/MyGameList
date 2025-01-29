namespace MyGameList.Models
{
    public class UserGame // this is to link user and game in a many to many relationship
    {
        public int userId { get; set; }
            
        public int gameId { get; set; }

        public int Rating { get; set; }

        //public User User { get; set; }

        //public Game Game { get; set; }


        // constructor for UserGame
        public UserGame(int userId, int gameId) //User user, Game game)
        {
            this.userId = userId;
            this.gameId = gameId;
            this.Rating = 0;
            //this.User = user;
            //this.Game = game;
        }
    }
}
