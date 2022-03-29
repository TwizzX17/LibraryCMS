using System.Collections.Generic;

namespace LibraryCmsShared.Models
{
    public class Genre
    {
        public Genre()
        {
            Books = new List<BookGenres>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string PicturePath { get; set; }

        public ICollection<BookGenres> Books { get; set; }
    }
}