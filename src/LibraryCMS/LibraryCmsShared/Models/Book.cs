using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryCmsShared.Models
{
    public class Book
    {
        public Book()
        {
            Genres = new List<BookGenres>();
            Rentals = new List<Rental>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, StringLength(60)]
        public string Title { get; set; }
        public string Author { get; set; }
        [Required, StringLength(2500)]
        public string Resume { get; set; }
        public string PicturePath { get; set; }
        public int PageCount { get; set; }
        public string Publisher { get; set; }
        public DateTime PublishedOn { get; set; }
        public int Status { get; set; }
        public int DefaultRentalDays { get; set; }
        public int BooksInStock { get; set; }
        

        public ICollection<BookGenres> Genres { get; set; }
        public ICollection<Rental> Rentals { get; set; }

        public void AddGenre(Genre genre)
        {
            Genres.Add(new BookGenres()
            {
                Genre = genre
            });
        }

        public void AddRental(Rental rental)
        {
            Rentals.Add(new Rental()
            {
                BookTitle = rental.BookTitle,
                RentalDate = rental.RentalDate,
                ReturnDeadline = rental.ReturnDeadline,
                UserId = rental.UserId,
                BookId = rental.BookId
            });
        }

        public void AddGenre(int genreId)
        {
            Genres.Add(new BookGenres()
            {
                GenreId = genreId
            });
        }

        public void RemoveGenre(int genreId)
        {
            Genres.Remove(new BookGenres()
            {
                GenreId = genreId
            });
        }
    }
}