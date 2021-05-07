using System;

namespace TrelloTemplateCreator.Data.Models
{
    public class CrearListaResult
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Boolean Closed { get; set; }
        public int Pos { get; set; }
        public string IdBoard { get; set; }
        public object limits { get; set; }
    }
}
