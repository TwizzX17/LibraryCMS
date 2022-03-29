using LibraryCmsShared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LibraryCms.Controllers
{
    public class GenreController : ControllerBase
    {

        private readonly LibraryCmsShared.Context _context = null;

        public GenreController()
        {
            _context = new LibraryCmsShared.Context();
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetGenres()
        {
            List<Genre> Genres 
                = new ();

            Genres = _context.Genres
                .Include(g => g.Books)
                .OrderBy(g => g.Name)
                .ToList();

            if (Genres != null)
            {
                var json = JsonConvert.SerializeObject(Genres, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        PreserveReferencesHandling = PreserveReferencesHandling.Objects
                    });
                IActionResult response = Ok(json);
                return response;
            }
            else
            {
                var json = JsonConvert.SerializeObject(Genres, Formatting.Indented);
                IActionResult response = BadRequest(json);
                return response;
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetGenreById(int Id)
        {
            Genre gotGenre = new Genre();

            gotGenre = _context.Genres
                .Where(g => g.Id == Id)
                .SingleOrDefault();

            if (gotGenre != null)
            {
                var json = JsonConvert.SerializeObject(gotGenre, Formatting.Indented);
                IActionResult response = Ok(json);
                return response;
            }
            else
            {
                var json = JsonConvert.SerializeObject(gotGenre, Formatting.Indented);
                IActionResult response = BadRequest(json);
                return response;
            }
        }

        [Authorize]
        [HttpPost]
        public IActionResult CreateGenre([FromBody] Genre genre)
        {
            //prepare response data
            Dictionary<string, string> data =
                new();
            //TODO: Verify that user is admin. Then proceed to create a new book
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    _context.Genres.Add(genre);

                    //Refer to CreateBook in the Book controller if persisting this data becomes a problem.

                    _context.SaveChanges();

                    //set response data
                    data.Add("state", "true");
                    data.Add("description", "Genre successfully added!");
                    data.Add("data", "");

                    var json = JsonConvert.SerializeObject(data, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    data.Add("state", "false");
                    data.Add("description", "Genre Could not be added!");
                    data.Add("data", "");

                    var json = JsonConvert.SerializeObject(data, Formatting.Indented);
                    IActionResult response = BadRequest(json);
                    return response;
                }

            }
            else
            {
                return BadRequest("Invalid Credentials");
            }
        }

        [Authorize]
        [HttpPut]
        public IActionResult UpdateGenre([FromBody] Genre genre)
        {

            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    _context.Genres.Attach(genre);
                    var genreEntry = _context.Entry(genre);

                    genreEntry.Property("Id").IsModified = false;
                    genreEntry.State = EntityState.Modified;
                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(genre, Formatting.Indented,
                        new JsonSerializerSettings
                        {
                            PreserveReferencesHandling = PreserveReferencesHandling.Objects
                        });
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject(genre, Formatting.Indented);
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
        public IActionResult DeleteGenre([FromBody] int Id)
        {

            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    var genre = new Genre() { Id = Id };

                    _context.Entry(genre).State = EntityState.Deleted;

                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(genre, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject("Genre could not be deleted.", Formatting.Indented);
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
