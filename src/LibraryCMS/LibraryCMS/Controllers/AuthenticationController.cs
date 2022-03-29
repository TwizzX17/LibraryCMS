using LibraryCmsShared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LibraryCms.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        private IConfiguration _config;
        private static LibraryCmsShared.Context _context;

        public AuthenticationController(IConfiguration config)
        {
            _config = config;
            _context = new LibraryCmsShared.Context();
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult Login([FromBody] User login)
        {

            IActionResult response = Unauthorized();
            var user = AuthenticateUser(login);

            if (user != null)
            {
                var JsonWebToken = GenerateJSONWebToken(user);
                response = Ok(new { token = JsonWebToken });
            }           return response;
        }

        private string GenerateJSONWebToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //Adding Specific infomation to our new variable 'Claim'
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.IsAdmin.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            //Here we create and add information to our token
            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
              claims,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static bool IsUser(string nameid)
        {
            if (_context.Users.Where(u => u.Id.ToString() == nameid).SingleOrDefault() != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool IsAdminUser(string nameid)
        {
            if (_context.Users.Where(u => u.Id.ToString() == nameid && u.IsAdmin == true).SingleOrDefault() != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private User AuthenticateUser(User user)
        {
            //Default equals null
            UserController User = new UserController();
            
            return User.UserLogin(user.Email, user.Password);
        }

    }
}
