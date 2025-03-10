using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyGameList.Helpers;
using MyGameList.Models;

namespace MyGameList.Controllers
{
    [ApiController] // automatically validates model
    [Route("api/[controller]")]

    public class GameController : Controller
    {
        [HttpGet("search")] // search for games
        public async Task<ActionResult<IEnumerable<Game>>> SearchGames([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty.");
            }

            var games = TempGames.Games
                .Where(g => g.Title.Contains(query))
                .ToList();

            if (!games.Any())
            {
                return NotFound($"No games found matching '{query}'.");
            }

            return Ok(games);
        }
    }
}
