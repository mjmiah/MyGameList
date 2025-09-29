using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

public class IgdbAuthService
{
    private readonly IConfiguration _config;
    private string? _token;
    private DateTime _expiry;

    public IgdbAuthService(IConfiguration config)
    {
        _config = config;
    }

    public async Task<string> GetAccessTokenAsync()
    {
        // Return cached token if still valid
        if (!string.IsNullOrEmpty(_token) && _expiry > DateTime.UtcNow.AddMinutes(1))
            return _token;

        var client = new HttpClient();
        var clientId = _config["IGDB:ClientId"];
        var clientSecret = _config["IGDB:ClientSecret"];
        var url = $"https://id.twitch.tv/oauth2/token?client_id={clientId}&client_secret={clientSecret}&grant_type=client_credentials";

        var response = await client.PostAsync(url, null);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<IgdbTokenResponse>(content);

        _token = result?.access_token;
        _expiry = DateTime.UtcNow.AddSeconds(result?.expires_in ?? 0);

        return _token!;
    }

    private class IgdbTokenResponse
    {
        public string access_token { get; set; } = null!;
        public int expires_in { get; set; }
        public string token_type { get; set; } = null!;
    }
}
