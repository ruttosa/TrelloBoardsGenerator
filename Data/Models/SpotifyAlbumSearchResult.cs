using TrelloTemplateCreator.Data.Models;

namespace TrelloTemplateCreator.Data
{
    public class SpotifyAlbumSearchResult
    { 
        public string Href { get; set; }
        public SpotifyAlbum[] Items { get; set; }
        public int Limit { get; set; }
        public string Next { get; set; }
        public int Offset { get; set; }
        public string Previous { get; set; }
        public int Total { get; set; }
    }
}
