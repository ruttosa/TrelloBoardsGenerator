using TrelloTemplateCreator.Data.Models;

namespace TrelloTemplateCreator.Services.Interfaces
{
    public interface ISpotifyService
    {
        public SpotifyAlbumSearch searchAlbumsByTitle(string query);

        public string Auth();
    }
}
