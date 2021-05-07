using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TrelloTemplateCreator.Data.Models;
using TrelloTemplateCreator.Services.Interfaces;

namespace TrelloTemplateCreator.Services
{
    public class DiscographyServices : IDiscographyServices
    {
        public List<Album> getAlbumsFromBase64File(string base64FileString)
        {
            List<Album> result = new List<Album>();
            //string fileType = base64FileString.Split(';')[0];
            string fileString = base64FileString.Split(';')[1].Split(',')[1];
            Byte[] bytes = Convert.FromBase64String(fileString);
            using(StreamReader stream = new StreamReader(new MemoryStream(bytes)))
            {
                do
                {
                    string fileLine = stream.ReadLine();
                    string year = fileLine.Substring(0, 4).Trim(); ;
                    string albumTitle = fileLine.Substring(5, fileLine.Length - 5).Trim();

                    result.Add(new Album(Convert.ToInt32(year), albumTitle));                    

                } while (!stream.EndOfStream);
            }
            return result;
        }
    }
}
