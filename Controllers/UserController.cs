using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyGameList.Helpers;
using MyGameList.Models;

namespace MyGameList.Controllers
{
    [ApiController] // automatically validates model
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly AppDbContext _context;
        private readonly AuthManager _authManager;

        public UserController(AppDbContext context, AuthManager authManager)
        {
            // inject AppDbContext into the controller so it can interact with database
            _context = context; // AppDbContext dependency injection

            _authManager = authManager; // for JWT tokens
        }

        
        // doing this so user shows up as a model when testing
        [HttpGet("{id}")] // get user from id 
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }



        [HttpGet("{userId}/games")] // get the list of games
        public async Task<ActionResult<IEnumerable<Game>>> GetUserGames([FromQuery] int userId)
        {
            var user = await _context.Users.FindAsync(userId); // get the user from their id

            if (user == null) // user not found
            {
                return NotFound($"Unable to find user {userId}");
            }

            return Ok(user.UserGames); // user found then return their list of games
        }



        [HttpPost("{userId}/games/{gameId}")] // add a game to the user's list
        public async Task<IActionResult> AddGame(int userId, int gameId)
        {
            var user = await _context.Users.FindAsync(userId); // get the user from their id

            if (user == null) // user not found
            {
                return NotFound($"Unable to find user {userId}");
            }

            var game = await _context.Games.FindAsync(gameId); // get the game from their id

            if (game == null) // game not found
            {
                return NotFound($"Unable to find game {gameId}");
            }

            var userGame = new UserGame(userId, gameId); //user, game);

            user.UserGames.Add(userGame); // add the game to the list
            await _context.SaveChangesAsync(); // save the list to the database

            return Ok(user.UserGames); // return updated list of games
        }



        [HttpDelete("{userId}/games/{gameId}")] // delete a game from the user's list
        public async Task<IActionResult> DeleteGame(int userId, int gameId)
        {
            // we need the user and the userGame entry to remove the game from their list
            
            var user = await _context.Users.FindAsync(userId); // get the user from their id

            if (user == null) // user not found
            {
                return NotFound($"Unable to find user {userId}");
            }

            var userGame = await _context.UserGames.FindAsync(userId, gameId); // find the game in the user's list

            if (userGame == null) // game for that user not found
            {
                return NotFound($"This game is not in the user's list.");
            }

            user.UserGames.Remove(userGame); // remove the game from the list
            await _context.SaveChangesAsync(); // save the list to the database

            return NoContent(); // delete successful
        }



        [HttpPut("{userId}/games/{gameId}/rating")] // rate a game in the user's list
        public async Task<IActionResult> RateGame(int userId, int gameId, [FromBody] int rating)
        {
            var userGame = await _context.UserGames.FindAsync(userId, gameId); // find the game in the user's list

            if (userGame == null) // game for that user not found
            {
                return NotFound($"This game is not in the user's list.");
            }

            userGame.Rating = rating; // add or update the rating

            await _context.SaveChangesAsync(); // save the list to the database

            return NoContent(); // rating successful
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            if (ModelState.IsValid)
            {
                // check if the user already exists
                var currentUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == model.Username); // using firstordefault because username isnt a primary key

                if (currentUser != null)
                {
                    return BadRequest("Username is already taken.");
                }

                // hash the password
                var passwordHash = new PasswordHasher<string>().HashPassword(null, model.Password);

                // create the new user
                var user = new User // entity framework automatically assigns userId
                {

                    Username = model.Username,
                    Password = passwordHash,
                    UserGames = new List<UserGame>()
                };

                // Save the user to the database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok("User registered successfully."); // success
            }

            return BadRequest("Invalid registration data."); // else invalid details
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login(Login model)
        {
            // find the user by username
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);

            if (user == null) // User not found
            {
                return Unauthorized("Invalid username or password.");
            }

            // verify the password using the PasswordHasher
            var passwordVerificationResult = new PasswordHasher<User>().VerifyHashedPassword(user, user.Password, model.Password);

            if (passwordVerificationResult == PasswordVerificationResult.Failed) // Incorrect password
            {
                return Unauthorized("Invalid username or password.");
            }

            // if credentials are correct, generate a JWT token
            var token = _authManager.GenerateJwtToken(user.userId.ToString(), user.Username);

            return Ok(new { Token = token });
        }


    }
}
