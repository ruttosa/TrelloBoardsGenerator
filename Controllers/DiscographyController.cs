using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrelloTemplateCreator.Data.Models;
using TrelloTemplateCreator.Data.ViewModels;
using TrelloTemplateCreator.Services.Interfaces;

namespace TrelloTemplateCreator.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DiscographyController : ControllerBase
    {
        private readonly IDiscographyServices ds;
        private readonly ITrelloServices ts;
        private readonly ISpotifyService ss;
        public DiscographyController(IDiscographyServices _fileServices, ITrelloServices _trelloServices, ISpotifyService _spotifyServices)
        {
            ds = _fileServices;
            ts = _trelloServices;
            ss = _spotifyServices;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult> Post([FromBody] DiscographyPostData bodyObj)
        {
            try
            {
                // Obtener Albums
                List<Album> albumsList = ds.getAlbumsFromBase64File(bodyObj.File);

                // Ordenar los datos
                List<Album> orderedAlbums = albumsList.OrderBy(album => album.Year).ThenBy(album => album.Title).ToList();

                // Preparar los datos (Obtener décadas de discos)
                var groupedByDecade = orderedAlbums.GroupBy(album => Utils.Utils.GetDecade(album.Year)).OrderByDescending(x => Utils.Utils.GetDecade(x.Key));              

                // Crear tablero de Trello
                CrearTableroResult tablero = ts.CrearTablero(bodyObj.DashboardTitle);
                if(tablero != null)
                {
                    // Crear listas de décadas en tablero de Trello
                    foreach (var decade in groupedByDecade)
                    {
                        CrearListaResult lista = ts.CrearLista(tablero.Id, String.Format("{0}s'", decade.Key.ToString()));
                        foreach (var album in decade)
                        {
                            // Crear tarjeta para el album
                            string tarjetaName = album.Year + " - " + album.Title;

                            CrearTarjetaResult tarjeta = ts.CrearTarjeta(lista.Id, tarjetaName);

                            // Obtener imagen del album de Spotify
                            SpotifyAlbumSearch albumsResult = ss.searchAlbumsByTitle(album.Title);

                            if (albumsResult != null)
                            {
                                SpotifyAlbum albumFound = albumsResult.albums.Items
                                                               .Where(x => x.Artists.FirstOrDefault().Name.ToLower().Equals("Bob Dylan".ToLower()))
                                                               .Where(x => Utils.Utils.homologarComilllas(x.Name).ToLower().Equals(Utils.Utils.homologarComilllas(album.Title).ToLower()))
                                                               .FirstOrDefault();
                                if (albumFound != null)
                                {
                                    SpotifyImage albumImage = albumFound.images.Where(x => x.Width == 300).FirstOrDefault();

                                    // Adjuntar imagen a la portada
                                    SpotifyImage attachedImage = ts.AdjuntarPortada(tarjeta.Id, albumImage.Url, "img_" + tarjetaName.Replace(" ",""));
                                }
                                else
                                {
                                    // Registrar de que albums no se encontraron portadas
                                    var t = album.Title;
                                }
                            }
                        }
                    }
                }

                return Ok();
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }
    }
}
