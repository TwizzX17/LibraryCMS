using LibraryCmsShared.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryCmsShared
{
    internal class DatabaseInitializer : DropCreateDatabaseAlways<Context>
    {
        protected override void Seed(Context context)
        {
            //This is our database's seed data
            Genre Adventure = new Genre()
            {
                Name = "Eventyr"
            };
            Genre Scifi = new Genre()
            {
                Name = "Science Fiction"
            };
            Genre Horror = new Genre()
            {
                Name = "Gys"
            };
            Genre Crime = new Genre()
            {
                Name = "Krimi"
            };
            Genre Fantasy = new Genre()
            {
                Name = "Fantasi"
            };
            Genre Grimdark = new Genre()
            {
                Name = "Grimdark"
            };
            Genre Humor = new Genre()
            {
                Name = "Humor"
            };

            var bookHarryPotter = new Book()
            {
                Title = "Harry Potter & the Half Blood Prince",
                Resume = "The story of Harry Potter & the Half Blood Prince unfolds many of the mysteries that have been build up so far in the story! Buckle up buckeroo with Ronald weasley and Sherry Hermione for yet another grand adventure with the Happy Potter!",
                PicturePath = @"~\public\images\harrypotterhalfblood.png",
                PageCount = 607,
                Publisher = "Bloomsbury (UK)",
                PublishedOn = DateTime.Parse("16-07-2005"),
                Status = 1,
                DefaultRentalDays = 14,
                BooksInStock = 3
            };
            bookHarryPotter.AddGenre(Fantasy);
            bookHarryPotter.AddGenre(Adventure);

            context.Books.Add(bookHarryPotter);
            context.SaveChanges();
        }
    }
}
