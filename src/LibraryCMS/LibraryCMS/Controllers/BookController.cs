using LibraryCmsShared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Security.Claims;

namespace LibraryCms.Controllers
{
    public class BookController : ControllerBase
    {

        private readonly LibraryCmsShared.Context _context = null;

        public BookController()
        {
            _context = new LibraryCmsShared.Context();
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult SearchAllRentableBooks(string searchtext)
        {
            List<Book> Books
                = new();

            Books = _context.Books
                .Where(b => b.Status == 1)
                .Where(b => b.Title.Contains(searchtext))
                .ToList();

            var json = JsonConvert.SerializeObject(Books, Formatting.Indented);
            IActionResult response = Ok(json);
            return response;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult SearchBooksByAuthor(string searchtext)
        {
            List<Book> Books
                = new();

            Books = _context.Books
                .Where(b => b.Status == 1)
                .Where(b => b.Author.Contains(searchtext))
                .ToList();


            var json = JsonConvert.SerializeObject(Books, Formatting.Indented);
            IActionResult response = Ok(json);
            return response;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult SearchBooksByGenre(string searchtext)
        {
            List<Book> books =
                new();

            books = _context.Books
                .Include(b => b.Genres)
                .Where(b => b.Genres.Select(g => g.Genre.Name).Contains(searchtext))
                .ToList();

            if (books != null)
            {
                foreach (var book in books)
                {
                    book.Genres.Clear();
                }

                var json = JsonConvert.SerializeObject(books, Formatting.Indented);
                IActionResult response = Ok(json);
                return response;
            }
            else
            {
                var json = JsonConvert.SerializeObject(books, Formatting.Indented);
                IActionResult response = BadRequest(json);
                return response;
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetBook(int Id)
        {
            Book gotBook = new ();

            gotBook = _context.Books
                .Include(b => b.Genres)
                .Where(b => b.Id == Id)
                .SingleOrDefault();

            if (gotBook != null)
            {
                var json = JsonConvert.SerializeObject(gotBook, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        PreserveReferencesHandling = PreserveReferencesHandling.Objects
                    });
                IActionResult response = Ok(json);
                return response;
            }
            else
            {
                var json = JsonConvert.SerializeObject(gotBook, Formatting.Indented);
                IActionResult response = BadRequest(json);
                return response;
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetAllBooks()
        {
            List<Book> books =
                new();

            books = _context.Books
                .Include(b => b.Genres)
                .ToList();
            if (books != null)
            {
                var json = JsonConvert.SerializeObject(books, Formatting.Indented,
                new JsonSerializerSettings
                {
                    PreserveReferencesHandling = PreserveReferencesHandling.Objects
                });
                IActionResult response = Ok(json);
                return response;
            }
            else
            {
                var json = JsonConvert.SerializeObject(books, Formatting.Indented);
                IActionResult response = BadRequest(json);
                return response;
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetBooksByGenreId(int Id)
        {
            List<Book> books = 
                new ();

            books = _context.Books
                .Include(b => b.Genres)
                .Where(b => b.Genres.Select(g => g.GenreId).Contains(Id))
                .ToList();

            if (books != null)
            {
                foreach (var book in books)
                {
                    book.Genres.Clear();
                }

                var json = JsonConvert.SerializeObject(books, Formatting.Indented);
                IActionResult response = Ok(json);
                return response;
            }
            else
            {
                var json = JsonConvert.SerializeObject(books, Formatting.Indented);
                IActionResult response = BadRequest(json);
                return response;
            }
        }


        [Authorize]
        [HttpPost]
        public IActionResult CreateBook([FromBody] Book book)
        {
            //prepare response data
            Dictionary<string, string> data =
                new();
            //TODO: Verify that user is admin. Then proceed to create a new book
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId)) { 
                try
                {
                    _context.Books.Add(book);

                    //EF automatically refers to the related tables foreign key if the foreign key
                    //is provided by the body related element.
                    //In this case, it's GenreId being provided in the body's Genre[]
                    //e.g. [{"GenreId" : 1}]

                    _context.SaveChanges();

                    //set response data
                    data.Add("state", "true");
                    data.Add("description", "Book successfully added!");
                    data.Add("data", "");

                    var json = JsonConvert.SerializeObject(data, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    data.Add("state", "false");
                    data.Add("description", "Book Could not be added!");
                    data.Add("data", "");

                    var json = JsonConvert.SerializeObject(data, Formatting.Indented);
                    IActionResult response = BadRequest(json);
                    return response;
                }
                
            } else
            {
                return BadRequest("Invalid Credentials");
            }
        }

        [Authorize]
        [HttpPut]
        public IActionResult UpdateBook([FromBody] Book book)
        {

            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    var currentBook = _context.Books.Include(b => b.Genres).Where(b => b.Id == book.Id).SingleOrDefault();
                    currentBook.Author = book.Author;
                    currentBook.BooksInStock = book.BooksInStock;
                    currentBook.DefaultRentalDays = book.DefaultRentalDays;
                    currentBook.PageCount = book.PageCount;
                    currentBook.PicturePath = book.PicturePath;
                    currentBook.PublishedOn = book.PublishedOn;
                    currentBook.Publisher = book.Publisher;
                    currentBook.Resume = book.Resume;
                    currentBook.Status = book.Status;
                    currentBook.Title = book.Title;

                    List<int> NewIdList = book.Genres.Select(b => b.GenreId).ToList();
                    List<int> OldIdList = currentBook.Genres.Select(b => b.GenreId).ToList();
                    NewIdList.ForEach(item => OldIdList.Remove(item));

                    _context.Books.Attach(currentBook);
                    foreach (var id in NewIdList)
                    {
                        if (!currentBook.Genres.Select(g => g.GenreId).Contains(id))
                        {
                            currentBook.AddGenre(id);
                        }
                    }

                    foreach (var id in OldIdList)
                    {
                        if (currentBook.Genres.Select(g => g.GenreId).Contains(id))
                        {
                            _context.BookGenres.Remove(_context.BookGenres.Single(bg => bg.GenreId == id && bg.BookId == currentBook.Id));
                            _context.SaveChanges();
                        }
                    }

                    var bookEntry = _context.Entry(currentBook);
                    bookEntry.Property("Id").IsModified = false;
                    bookEntry.State = EntityState.Modified;
                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(currentBook, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        PreserveReferencesHandling = PreserveReferencesHandling.Objects
                    });
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject(book, Formatting.Indented,
                        new JsonSerializerSettings
                        {
                            PreserveReferencesHandling = PreserveReferencesHandling.Objects
                        });
                    IActionResult response = BadRequest(json);
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be An Administrator To Do This Action.");
                return response;
            }
        }

        [Authorize]
        [HttpDelete]
        public IActionResult DeleteBook([FromBody] int Id)
        {

            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    var book = new Book() { Id = Id };

                    _context.Entry(book).State = EntityState.Deleted;
                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(book, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject("Book could not be deleted.", Formatting.Indented);
                    IActionResult response = BadRequest(json);
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be An Administrator To Do This Action.");
                return response;
            }
        }
    }
}
