using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryCmsShared.Models
{
    public class User
    {
        public User()
        {
            Rentals = new List<Rental>();
        }
        public int Id { get; set; }
        [Required, StringLength(80)]
        public string Email { get; set; }
        [Required, StringLength(120)]
        public string Password { get; set; }
        [Required, StringLength(120)]
        public string FullAddress { get; set; }
        public int LoanLimit { get; set; }
        public bool ApprovedUser { get; set; }
        [Required]
        public bool IsAdmin { get; set; }
        public DateTime Created { get; set; }
        public ICollection<Rental> Rentals { get; set; }
    }
}