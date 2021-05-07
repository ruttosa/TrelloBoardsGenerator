using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrelloTemplateCreator.Utils
{
    public static class Utils
    {
        public static int GetDecade(int year)
        {
            return year < 2000 ? (year / 10 * 10 - 1900) : (year / 10 * 10);
        }
        public static string homologarComilllas(string _string)
        {
            int comilla = _string.IndexOf('’');
            if (comilla > 0)
                _string = _string.Replace('’', '\'');
            return _string;
        }
    }
}
