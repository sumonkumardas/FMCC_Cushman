using System.Web.Mvc;

namespace Fmcc.Extension
{
    public class AllowAnonymousButNotAuthenticated : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!filterContext.Equals(null))
            {
                if (!filterContext.HttpContext.Equals(null))
                {
                    if (!filterContext.HttpContext.User.Equals(null))
                    {
                        if (filterContext.RouteData.Values["controller"].ToString().ToLower() == "account" && filterContext.RouteData.Values["action"].ToString().ToLower() == "login")
                        {                           
                            filterContext.RouteData.Values["controller"] = "home";
                            filterContext.RouteData.Values["action"] = "index";
                        }
                    }
                }
            }
          
            base.OnActionExecuting(filterContext);
        }
    }
}