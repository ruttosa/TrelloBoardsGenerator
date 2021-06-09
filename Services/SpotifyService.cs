using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using TrelloTemplateCreator.Data.Models;

namespace TrelloTemplateCreator.Services.Interfaces
{
    public class SpotifyService : ISpotifyService
    {
        private readonly IConfiguration config;
        private const string baseAddress = "https://api.spotify.com/v1";
        private string spotifyToken = "";
        private string spotifyTokenType = "";
        public SpotifyService(IConfiguration _configuration)
        {
            config = _configuration;
            Authorize();
        }

        private string Authorize()
        {
            using (var httpClient = new HttpClient())
            {
                string authUrl = "https://accounts.spotify.com/api/token";
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "ZDc0MmM2Mjg0MGU5NGU0MDliZjc3MzM1MDkyNDI2YzY6MGRlODcwZDQ0MTlkNDBkNWFiMGYwMWNlZDg2YzY2MDY");
                var keyValues = new List<KeyValuePair<string, string>>();
                keyValues.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
                
                HttpContent content = new FormUrlEncodedContent(keyValues);

                HttpResponseMessage result = httpClient.PostAsync(authUrl, content).Result;
                if (result.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    string resultString = result.Content.ReadAsStringAsync().Result;
                    SpotifyAuth authResult = JsonConvert.DeserializeObject<SpotifyAuth>(resultString);
                    spotifyToken = authResult.Access_token;
                    spotifyTokenType = authResult.Token_type;
                    return authResult.Access_token;
                }
            }
            return null;
        }

        public string Auth()
        {
            return Authorize();
        }
        public SpotifyAlbumSearch searchAlbumsByTitle(string query)
        {
            using (var httpClient = new HttpClient())
            {
                string url = baseAddress + 
                                String.Format("/search?q={0}&type=album",query);
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(spotifyTokenType, spotifyToken);

                HttpResponseMessage result = httpClient.GetAsync(url).Result;
                if (result.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    string resultString = result.Content.ReadAsStringAsync().Result;
                    SpotifyAlbumSearch searchResult = JsonConvert.DeserializeObject<SpotifyAlbumSearch>(resultString);
                    return searchResult;
                }
            }
            return null;
        }
    }
}
