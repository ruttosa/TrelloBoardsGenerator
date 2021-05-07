using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrelloTemplateCreator.Data.Models;

namespace TrelloTemplateCreator.Services.Interfaces
{
    public interface IDiscographyServices
    {
        public List<Album> getAlbumsFromBase64File(string base64FileString);
    }
}
