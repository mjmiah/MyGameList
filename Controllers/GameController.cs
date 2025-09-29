using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyGameList.Models;
using System.Net.Http.Headers;
using System.Text.Json;

namespace MyGameList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : Controller
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly IgdbAuthService _authService;

        public GameController(IConfiguration config, IgdbAuthService authService)
        {
            _config = config;
            _authService = authService;
            _httpClient = new HttpClient();
        }

        // search for games using IGDB
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Game>>> SearchGames([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty.");
            }

            var clientId = _config["IGDB:ClientId"];
            var token = await _authService.GetAccessTokenAsync();

            // configure headers for IGDB API request
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Client-ID", clientId);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var body = $"fields name,cover.url, id; search \"{query}\"; limit 20;";

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.igdb.com/v4/games")
            {
                Content = new StringContent(body)
            };
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to fetch data from IGDB.");
            }

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var games = new List<Game>();

            foreach (var element in doc.RootElement.EnumerateArray())
            {
                var title = element.GetProperty("name").GetString() ?? "Unknown Title";
                var igdbId = element.GetProperty("id").GetInt32().ToString();

                string? imageUrl = null;
                if (element.TryGetProperty("cover", out var cover))
                {
                    imageUrl = cover.GetProperty("url").GetString();
                }

                games.Add(new Game
                {
                    Title = title,
                    igdbId = igdbId,
                    imageUrl = imageUrl?.Replace("t_thumb", "t_1080p")
                });
            }

            if (!games.Any())
            {
                return NotFound($"No games found matching '{query}'.");
            }

            return Ok(games);
        }
    }
}