namespace TrelloTemplateCreator.Data.Models
{
    public class SpotifyAlbum
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Album_type { get; set; }
        public SpotifyArtist[] Artists { get; set; }
        public string Href { get; set; }
        public SpotifyImage[] images { get; set; }
        public string Release_date { get; set; }
        public string Release_date_precision { get; set; }
        public string Total_tracks { get; set; }
        public string Type { get; set; }
    }
}
