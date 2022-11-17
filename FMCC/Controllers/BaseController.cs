using Fmcc.Security;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Web.Security;

namespace Fmcc.Controllers
{
    public class BaseController : Controller
    {
        protected UserData UserInfo
        {
            get
            {
                UserData info = new UserData();
                if (HttpContext.User != null)
                {
                    if (HttpContext.User.Identity.IsAuthenticated)
                    {
                        if (HttpContext.User.Identity is FormsIdentity)
                        {
                            FormsIdentity formsIdentity = HttpContext.User.Identity as FormsIdentity;
                            FormsAuthenticationTicket formsAuthenticationTicket = formsIdentity.Ticket;
                            string userData = formsAuthenticationTicket.UserData;
                            info = JsonConvert.DeserializeObject<UserData>(formsAuthenticationTicket.UserData);
                        }
                    }
                }
                return info;
            }
        }
    }
}