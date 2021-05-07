using TrelloTemplateCreator.Data.Models;

namespace TrelloTemplateCreator.Services.Interfaces
{
    public interface ITrelloServices
    {
        public CrearTableroResult CrearTablero(string nombreTablero);
        public CrearListaResult CrearLista(string tableroId, string nombreLista);
        public CrearTarjetaResult CrearTarjeta(string listaId, string tituloTarjeta);
        public SpotifyImage AdjuntarPortada(string tarjetaId, string imageUrl, string imageName);
    }
}
