using System.Web.Mvc;

namespace Fmcc.Security
{
    public class UnAuthorizedAttribute : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {            
            base.HandleUnauthorizedRequest(filterContext);
        }
    }
}