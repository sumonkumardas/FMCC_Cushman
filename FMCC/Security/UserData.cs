using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Security
{
    public class UserData
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public string Roles { get; set; }
    }
}