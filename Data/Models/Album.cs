namespace TrelloTemplateCreator.Data.Models
{
    public class Album
    {
        public int Year { get; set; }
        public string Title { get; set; }
        public string Thumbnail { get; set; }

        public Album(int _Year, string _Title)
        {
            Year = _Year;
            Title = _Title;
        }
    }
}
