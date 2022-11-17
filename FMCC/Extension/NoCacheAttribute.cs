using System;
using System.Web;
using System.Web.Mvc;

namespace Fmcc.Extension
{
    public class NoCacheAttribute : ActionFilterAttribute
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                filterContext.HttpContext.Response.Cache.SetNoStore();
                filterContext.HttpContext.Response.Cache.SetNoServerCaching();
                filterContext.HttpContext.Response.Cache.SetExpires(DateTime.Now);
                filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
            }
            base.OnActionExecuting(filterContext);
        }
    }
}