using System.Web.Http;

namespace Fmcc
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.EnableCors();
            config.MapHttpAttributeRoutes();
            //config.Filters.Add(new AuthorizeAttribute());
            config.Routes.MapHttpRoute("apiDefault", "api/{controller}/{id}", new { id = RouteParameter.Optional });
            config.Routes.MapHttpRoute("serviceDefault", "service/{controller}/{action}", new { action = RouteParameter.Optional });
        }
    }
}
