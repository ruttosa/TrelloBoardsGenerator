using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using TrelloTemplateCreator.Data.Models;
using TrelloTemplateCreator.Services.Interfaces;

namespace TrelloTemplateCreator.Services
{
    public class TrelloServices : ITrelloServices
    {
        /*  Get Api Key from Trello on https://trello.com/app-key
         *  Generate Trello Token on https://trello.com/1/authorize?expiration=1day&name=MyPersonalToken&scope=read&response_type=token&key={YourAPIKey}
         *
         *  This token, along with your API key, can be used to read and write
         *  for your entire Trello account. Tokens should be kept secret!
         */
        private readonly IConfiguration config;
        private const string serviceBaseUrl = "https://api.trello.com/1";

        public TrelloServices(IConfiguration _configuration)
        {
            config = _configuration;
        }

        // Crear Tablero
        public CrearTableroResult CrearTablero(string nombreTablero)
        {
            using (var httpClient = new HttpClient())
            {
                string url = serviceBaseUrl + 
                                String.Format(@"/boards?key={0}&token={1}&name={2}&defaultLists=false", 
                                            config.GetValue<string>("TrelloKey"), 
                                            config.GetValue<string>("TrelloToken"), 
                                            nombreTablero);
                HttpContent content = null;
                HttpResponseMessage result = httpClient.PostAsync(url, content).Result;
                if(result.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    string resultString = result.Content.ReadAsStringAsync().Result;
                    return JsonConvert.DeserializeObject<CrearTableroResult>(resultString);
                }
            }
            return null;
        }

        // Crear Lista
        public CrearListaResult CrearLista(string tableroId, string nombreLista)
        {
            using (var httpClient = new HttpClient())
            {
                string url = serviceBaseUrl + 
                                String.Format(@"/lists?key={0}&token={1}&name={2}&idBoard={3}",
                                                config.GetValue<string>("TrelloKey"), 
                                                config.GetValue<string>("TrelloToken"), 
                                                nombreLista, 
                                                tableroId);
                HttpContent content = null;
                HttpResponseMessage result = httpClient.PostAsync(url, content).Result;
                if (result.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    string resultString = result.Content.ReadAsStringAsync().Result;
                    return JsonConvert.DeserializeObject<CrearListaResult>(resultString);
                }
            }
            return null;
        }

        // Crear Tarjeta
        public CrearTarjetaResult CrearTarjeta(string listaId, string tituloTarjeta)
        {
            using (var httpClient = new HttpClient())
            {
                string url = serviceBaseUrl + 
                                String.Format(@"/cards?key={0}&token={1}&name={2}&idList={3}",
                                            config.GetValue<string>("TrelloKey"),
                                            config.GetValue<string>("TrelloToken"),
                                            tituloTarjeta,
                                            listaId);
                HttpContent content = null;
                HttpResponseMessage result = httpClient.PostAsync(url, content).Result;
                if (result.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    string resultString = result.Content.ReadAsStringAsync().Result;
                    return JsonConvert.DeserializeObject<CrearTarjetaResult>(resultString);
                }
            }
            return null;
        }

        public SpotifyImage AdjuntarPortada(string tarjetaId, string imageUrl, string imageName)
        {
            using (var httpClient = new HttpClient())
            {
                string url = serviceBaseUrl +
                                String.Format(@"/cards/{0}/attachments?key={1}&token={2}&url={3}&name={4}&setCover=true",
                                            tarjetaId,
                                            config.GetValue<string>("TrelloKey"),
                                            config.GetValue<string>("TrelloToken"),
                                            imageUrl,
                                            imageName);
                HttpContent content = null;
                HttpResponseMessage result = httpClient.PostAsync(url, content).Result;
                if (result.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    string resultString = result.Content.ReadAsStringAsync().Result;
                    return JsonConvert.DeserializeObject<SpotifyImage>(resultString);
                }
            }
            return null;
        }

    }
}
