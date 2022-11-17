using System;
using System.Text;
using System.Web;
using System.Web.Security;

namespace Fmcc.Security
{
    public class CookieManager
    {
        public static HttpCookie GetCookie(string cookieName, HttpCookieCollection httpCookieCollection)
        {
            return httpCookieCollection[cookieName];
        }

        public static void DeleteCookie(string cookieName, HttpCookieCollection httpCookieCollection)
        {
            httpCookieCollection.Remove(cookieName);
        }

        public static HttpCookie CreateCookie(string cookieName, string keyName, string infoTicket, string secretKey, int expireTime)
        {
            string Id = HttpContext.Current.Session.SessionID;
            byte[] bytes = Encoding.UTF8.GetBytes(infoTicket);
            string encodedCookie = Convert.ToBase64String(MachineKey.Protect(bytes, secretKey));

            HttpCookie httpCookie = new HttpCookie(cookieName);
            httpCookie.Expires = DateTime.Now.AddMinutes(expireTime);
            httpCookie.Values.Add(keyName, encodedCookie);
            return httpCookie;
        }

        public static void UpdateCookie(HttpCookie httpCookie, int expireTime)
        {
            httpCookie.Expires.AddMinutes(expireTime);
        }

        public static bool CookieExist(string cookieName, HttpCookieCollection httpCookieCollection)
        {
            HttpCookie httpCookie = httpCookieCollection.Get(cookieName);
            return !httpCookie.Equals(null);
        }


    }
}