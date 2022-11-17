using System;

namespace Fmcc.Models
{
    public class UserSession
    {
        public int Id { get; set; }
        public Nullable<int> UserId { get; set; }
        public string SessionId { get; set; }
        public Nullable<System.DateTime> Expiration { get; set; }
        public Nullable<bool> MultipleBrowserAllowed { get; set; }
    }
}