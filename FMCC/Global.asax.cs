using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using System.Web.Routing;
using System.Web.Security;
using System.Security.Principal;
using System.IO;
using System.Web.SessionState;

namespace Fmcc
{
    public class Global : HttpApplication
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        //
        void Application_Start(object sender, EventArgs e)
        {
            try
            {
                FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
                AreaRegistration.RegisterAllAreas();
                GlobalConfiguration.Configure(WebApiConfig.Register);
                RouteConfig.RegisterRoutes(RouteTable.Routes);
                JobScheduler.JobScheduler.Start();
                log4net.Config.XmlConfigurator.Configure(new FileInfo(Server.MapPath("~/Web.config")));
                logger.Debug("Site Starting Debug....");

            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
            }
        }

        protected void Application_PostAuthorizeRequest()
        {
            HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
        }

        protected void Application_OnAuthenticateRequest(object src, EventArgs e)
        {
            HttpContext currentContext = HttpContext.Current;
            if (HttpContext.Current.User != null)
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    if (HttpContext.Current.User.Identity is FormsIdentity)
                    {
                        FormsIdentity id = HttpContext.Current.User.Identity as FormsIdentity;
                        FormsAuthenticationTicket ticket = id.Ticket;

                        string userData = ticket.UserData;

                        string[] rolesData = userData.Split(new Char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                        HttpContext.Current.User = new GenericPrincipal(id, rolesData);
                    }
                }
            }
            else
            {

            }
        }

    }
}