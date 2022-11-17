using System.Web;
using Fmcc.Security;
using Newtonsoft.Json;
using System.Web.Http;
using System.Web.Security;

namespace Fmcc.Controllers.ServiceControllers
{
    public class ApiBaseController : ApiController
    {
        protected UserData UserInfo
        {
            get
            {
                UserData info = new UserData();
                if (HttpContext.Current.User != null)
                {
                    if (HttpContext.Current.User.Identity.IsAuthenticated)
                    {
                        if (HttpContext.Current.User.Identity is FormsIdentity)
                        {
                            FormsIdentity formsIdentity = HttpContext.Current.User.Identity as FormsIdentity;
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