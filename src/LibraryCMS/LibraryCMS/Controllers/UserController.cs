using LibraryCmsShared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LibraryCms.Controllers
{
    public class UserController : ControllerBase
    {
        private readonly LibraryCmsShared.Context _context = null;

        public UserController()
        {
            _context = new LibraryCmsShared.Context();
        }

        [Authorize]
        public IActionResult GetUsers()
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                var users = _context.Users
                    .Select(u => u)
                    .Where(u => u.IsAdmin == false)
                    .ToList();


                if (users.Count > 0)
                {
                    var json = JsonConvert.SerializeObject(users, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                else
                {
                    IActionResult response = Ok("There are no users to retrieve.");
                    return response;
                }
            }
            else
            {
                IActionResult response = BadRequest("You need to be an administrator to get this data.");
                return response;
            }
        }

        [Authorize]
        public IActionResult GetAdminUsers()
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                var users = _context.Users
                    .Select(u => u)
                    .Where(u => u.IsAdmin == true)
                    .ToList();


                if (users.Count > 0)
                {
                    var json = JsonConvert.SerializeObject(users, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                else
                {
                    IActionResult response = Ok("There are no users to retrieve.");
                    return response;
                }
            }
            else
            {
                IActionResult response = BadRequest("You need to be an administrator to get this data.");
                return response;
            }
        }

        [Authorize]
        public IActionResult GetUser()
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsUser(NameId))
            {
                var user = _context.Users
                    .Select(u => u)
                    .Where(u => u.Id.ToString() == NameId)
                    .SingleOrDefault();


                if (user != null)
                {
                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                else
                {
                    IActionResult response = Ok("There is no user to retrieve. Something went wrong");
                    return response;
                }
            }
            else
            {
                IActionResult response = BadRequest("You need to be an administrator to get this data.");
                return response;
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult CreateUser([FromBody] User user)
        {
            //prepare response data
            Dictionary<string, string> data =
                new();
            try
            {
                _context.Users.Add(user);

                user.IsAdmin = false;
                user.ApprovedUser = false;
                user.LoanLimit = 3;
                user.Created = DateTime.UtcNow;
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

                _context.SaveChanges();

                //set response data
                data.Add("state", "true");
                data.Add("description", "User successfully added!");
                data.Add("data", "");
                //string success = "User created successfully";
                var json = JsonConvert.SerializeObject(data, Formatting.Indented);
                IActionResult response = Ok(json);
                return response;
            }
            catch
            {
                data.Add("state", "false");
                data.Add("description", $"User with email {user.Email} already exists");
                data.Add("data", "");
                //string Failiure = $"User with email {user.Email} already exists";
                var json = JsonConvert.SerializeObject(data, Formatting.Indented);
                IActionResult response = BadRequest(json);
                return response;
            }
        }

        [Authorize]
        [HttpPut]
        public IActionResult UpdateUser(string oldpassword, [FromBody] User user)
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsUser(NameId))
            {
                try
                {
                    var currentUser = _context.Users.Where(u => u.Id == user.Id).SingleOrDefault();
                    _context.Users.Attach(currentUser);
                    if(user.Password.Length > 0) { 
                        if(BCrypt.Net.BCrypt.Verify(oldpassword, currentUser.Password))
                        {
                            //update user with password change
                            currentUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                            currentUser.FullAddress = user.FullAddress;
                            currentUser.Email = user.Email;
                            var userEntry = _context.Entry(currentUser);

                            userEntry.Property("Id").IsModified = false;
                            userEntry.Property("IsAdmin").IsModified = false;
                            userEntry.Property("LoanLimit").IsModified = false;

                            userEntry.State = EntityState.Modified;
                            _context.SaveChanges();
                        }
                        else
                        {
                            IActionResult NoMatch = BadRequest("Old password did not match with current password.");
                            return NoMatch;
                        }
                    }
                    else
                    {
                        //update user without password change
                        currentUser.FullAddress = user.FullAddress;
                        currentUser.Email = user.Email;
                        var userEntry = _context.Entry(currentUser);

                        userEntry.Property("Id").IsModified = false;
                        userEntry.Property("IsAdmin").IsModified = false;
                        userEntry.Property("LoanLimit").IsModified = false;

                        userEntry.State = EntityState.Modified;
                        _context.SaveChanges();
                    }


                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = BadRequest(json);
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be Logged In To Do This Action.");
                return response;
            }
        }

        [Authorize]
        [HttpPut]
        public IActionResult UpgradeUserToAdmin([FromBody] User user)
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    _context.Users.Attach(user);
                    user.IsAdmin = true;
                    var userEntry = _context.Entry(user);
                    userEntry.Property("Id").IsModified = false;
                    userEntry.State = EntityState.Modified;
                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = BadRequest(json);
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be Logged In To Do This Action.");
                return response;
            }
        }

        [Authorize]
        [HttpPut]
        public IActionResult DowngradeAdminToUser([FromBody] User user)
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    _context.Users.Attach(user);
                    user.IsAdmin = false;
                    var userEntry = _context.Entry(user);
                    userEntry.Property("Id").IsModified = false;
                    userEntry.State = EntityState.Modified;
                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = BadRequest(json);
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be Logged In To Do This Action.");
                return response;
            }
        }


        [Authorize]
        [HttpGet]
        public IActionResult GetUnapprovedUsers()
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    List<User> users = _context.Users.Where(u => u.ApprovedUser == false).ToList();

                    var json = JsonConvert.SerializeObject(users, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    IActionResult response = StatusCode(205, "There are no un-approved users :)");
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be Logged In To Do This Action.");
                return response;
            }
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetApprovedUsers()
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    List<User> users = _context.Users.Where(u => u.ApprovedUser == true).ToList();

                    var json = JsonConvert.SerializeObject(users, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    IActionResult response = StatusCode(205, "There are no approved users :(");
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be Logged In To an Admin Account Do This Action.");
                return response;
            }
        }

        [Authorize]
        [HttpPut]
        public IActionResult ApproveUser([FromBody] User user)
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    _context.Users.Attach(user);
                    user.ApprovedUser = true;
                    var userEntry = _context.Entry(user);
                    userEntry.Property("Id").IsModified = false;
                    userEntry.State = EntityState.Modified;
                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = BadRequest(json);
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be Logged In To Do This Action.");
                return response;
            }
        }

        [Authorize]
        [HttpPut]
        public IActionResult DisapproveUser([FromBody] User user)
        {
            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    _context.Users.Attach(user);
                    user.ApprovedUser = false;
                    var userEntry = _context.Entry(user);
                    userEntry.Property("Id").IsModified = false;
                    userEntry.State = EntityState.Modified;
                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = BadRequest(json);
                    return response;
                }

            }
            else
            {
                IActionResult response = BadRequest("You Need To Be Logged In To Do This Action.");
                return response;
            }
        }

        [Authorize]
        [HttpDelete]
        public IActionResult DeleteUser([FromBody] User user)
        {

            var jwt = HttpContext.User.Identity as ClaimsIdentity;
            IEnumerable<Claim> claim = jwt.Claims;
            var NameId = claim.FirstOrDefault().Value;
            if (NameId != null && AuthenticationController.IsAdminUser(NameId))
            {
                try
                {
                    var userToDelete = _context.Users.Where(u => u.Id == user.Id).SingleOrDefault();

                    _context.Entry(userToDelete).State = EntityState.Deleted;

                    _context.SaveChanges();

                    var json = JsonConvert.SerializeObject(user, Formatting.Indented);
                    IActionResult response = Ok(json);
                    return response;
                }
                catch
                {
                    var json = JsonConvert.SerializeObject("User could not be deleted.", Formatting.Indented);
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

        public User UserLogin(string Mail, string Pass)
        {
            try { 
            var User = _context.Users
                .Where(u => u.Email == Mail)
                .SingleOrDefault();

            bool isValidPassword = BCrypt.Net.BCrypt.Verify(Pass, User.Password);
            if (isValidPassword)
            {
                return User;
            }
            return null;
            }
            catch
            {
                return null;
            }
        }
    }


}