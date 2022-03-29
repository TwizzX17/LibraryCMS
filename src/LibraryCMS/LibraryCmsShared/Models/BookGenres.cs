using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryCmsShared.Models
{
    public class BookGenres
    {
        //explicit bridge table
        public int Id { get; set; }
        public int BookId { get; set; }
        public int GenreId { get; set; }
        public Book Book { get; set; }
        public Genre Genre { get; set; }
    }
}