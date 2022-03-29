using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryCmsShared.Models
{
    public class Rental
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime ReturnDeadline { get; set; }

        public User User { get; set; }
        public Book Book { get; set; }
    }
}
