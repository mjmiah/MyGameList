using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyGameList.Models;
using MyGameList.Payloads;
using System.Security.Claims;

namespace MyGameList.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserGamesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserGamesController(AppDbContext context)
        {
            _context = context;
        }

        // GET all UserGames for the logged-in user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUserGames()
        {
            // get userId from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            // fetch UserGames for this user
            var userGames = await _context.UserGames
                .Where(ug => ug.userId == userId)
                .ToListAsync();

            // include game info, including igdbId and high-res image
            var result = new List<object>();

            foreach (var ug in userGames)
            {
                var game = await _context.Games.FindAsync(ug.gameId);

                result.Add(new
                {
                    ug.userId,
                    ug.gameId,
                    ug.Rating,
                    title = game?.Title,
                    imageUrl = game.imageUrl,
                    igdbId = game?.igdbId
                });
            }

            return Ok(result);
        }
        // POST to add a game to a user's list
        [HttpPost]
        public async Task<IActionResult> AddUserGame([FromBody] UserGamePayload payload)
        {
            // get userId from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            // check if game exists in Games table by igdbId
            var game = await _context.Games.FirstOrDefaultAsync(g => g.igdbId == payload.igdbId);
            if (game == null)
            {
                // if no title, cancel
                if (string.IsNullOrWhiteSpace(payload.Title))
                {
                    return BadRequest("Cannot add game: title is missing.");
                }

                // add new game to Games table
                game = new Game
                {
                    Title = payload.Title,
                    imageUrl = payload.imageUrl,
                    igdbId = payload.igdbId
                    
                };
                _context.Games.Add(game);
                await _context.SaveChangesAsync();
            }

            // check if user already has this game
            var exists = await _context.UserGames
                .AnyAsync(ug => ug.userId == userId && ug.igdbId == game.igdbId);
            if (exists)
                return BadRequest("Game already in user's list.");

            // add UserGame entry
            var userGame = new UserGame
            {
                userId = userId,
                gameId = game.gameId,
                Rating = payload.Rating,
                igdbId = payload.igdbId
            };
            _context.UserGames.Add(userGame);
            await _context.SaveChangesAsync();

            return Ok(userGame);
        }

        // PUT to update rating
        [HttpPut("{gameId}")]
        public async Task<IActionResult> UpdateRating(int gameId, [FromBody] UserGamePayload payload)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var userGame = await _context.UserGames
                .FirstOrDefaultAsync(ug => ug.userId == userId && ug.gameId == gameId);

            if (userGame == null)
                return NotFound("UserGame not found.");

            userGame.Rating = payload.Rating;
            await _context.SaveChangesAsync();

            return Ok(userGame);
        }

        // DELETE a game from user's list
        [HttpDelete("{gameId}")]
        public async Task<IActionResult> DeleteUserGame(int gameId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var userGame = await _context.UserGames
                .FirstOrDefaultAsync(ug => ug.userId == userId && ug.gameId == gameId);

            if (userGame == null)
                return NotFound("UserGame not found.");

            _context.UserGames.Remove(userGame);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
