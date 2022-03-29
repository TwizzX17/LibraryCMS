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
    public class RentalController : ControllerBase
    {

        private readonly LibraryCmsShared.Context _context = null;

        public RentalController()
        {
            _context = new LibraryCmsShared.Context();
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetRentals()
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && 
                _context.Users.Where(u => u.Id.ToString() == NameId).SingleOrDefault() != null)
            {   
                var rentals = _context.Rentals
                    .Include(r => r.User)
                    .Where(r => r.UserId.ToString() == NameId).ToList();

                List<Rental> rentalsToReturn = new ();

                if(rentals.Count >= 1) 
                {
                    rentals.ForEach(r => r.User.Rentals.Clear());

                    var json = JsonConvert.SerializeObject(rentals, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                else
                {
                    IActionResult response = StatusCode(205);
                    return response;
                }
            }
            IActionResult failedResponse = StatusCode(450);
            return failedResponse;
        }


        [Authorize]
        [HttpPost]
        public IActionResult RentBook([FromBody] Rental rental)
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && 
                _context.Users
                .Where(u => u.Id.ToString() == NameId && u.ApprovedUser == true).SingleOrDefault() != null)
            {

                //finding the book from the rentals bookid provided by the body
                Book bookToRent = _context.Books.Find(rental.BookId);

                //setting the return deadline to be the rental date provided by the body + 
                //the books default rental days
                rental.ReturnDeadline = rental.RentalDate.AddDays(bookToRent.DefaultRentalDays);
                rental.UserId = Convert.ToInt32(NameId);
                //Attaching the book to rent to the context
                _context.Books.Attach(bookToRent);

                //modifying the books rental table
                bookToRent.AddRental(rental);


                //setting the rental state to modified so the changes will be saved by EF
                var bookEntry = _context.Entry(bookToRent);
                bookEntry.State = System.Data.Entity.EntityState.Modified;

                //saving the changes
                _context.SaveChanges();


                //returning the rental object so the frontend knows what was saved to the db if everything went well.
                var json = JsonConvert.SerializeObject(rental, Formatting.Indented);
                IActionResult response = Ok(json);
                return response;
            } 
            else
            {
                IActionResult response = BadRequest("You Need to Log In to Rent a Book");
                return response;
            }
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetNextAvailableRentalDate(int bookId)
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsUser(NameId))
            {

                var book = _context.Books.Where(b => b.Id == bookId).SingleOrDefault();
                if(_context.Rentals.Where(r => r.BookId == book.Id).Count() > 0)
                {
                    var nextAvailableRentalDate = _context.Rentals.Where(br => br.BookId == book.Id)
                        .Select(r => r.ReturnDeadline)
                        .OrderBy(r => r)
                        .FirstOrDefault();

                    var json = JsonConvert.SerializeObject(nextAvailableRentalDate, Formatting.Indented,
                        new JsonSerializerSettings
                        {
                            PreserveReferencesHandling = PreserveReferencesHandling.Objects
                        });
                    IActionResult response = Ok(json);
                    return response;

                } 
                else
                {
                    DateTime nextAvailableRentalDate = DateTime.UtcNow;

                    var json = JsonConvert.SerializeObject(nextAvailableRentalDate, Formatting.Indented,
                        new JsonSerializerSettings
                        {
                            PreserveReferencesHandling = PreserveReferencesHandling.Objects
                        });
                    IActionResult response = Ok(json);
                    return response;
                }

            }
            return null;
        }

    }
}