using System.Web.Optimization;
namespace Fmcc
{
  public class BundleConfig
  {
    public static void RegisterBundles(BundleCollection bundles)
    {
      StyleBundle libStyle = new StyleBundle("~/bundles/styles/lib");
      libStyle
        .Include("~/Content/lib/bootstrap/bootstrap.min.css")
        .Include("~/Content/lib/iconfont/awesome/4.6.3/css/font-awesome.min.css")
        .Include("~/Content/lib/iconfont/ionicons/2.0.1/ionicons.min.css")
        .Include("~/Content/lib/iconfont/iconmoon/1.0.0/iconmoon.min.css")
        .Include("~/Content/lib/iconfont/linearicon/1.0.0/linearicon.min.css")
        .Include("~/Content/lib/jvectormap/jvectormap.min.css")
        .Include("~/Content/lib/select2/select2.min.css")
        .Include("~/Content/lib/admin/admin.min.css")
        .Include("~/Content/lib/admin/skins/all.min.css");
      bundles.Add(libStyle);

      StyleBundle appStyle = new StyleBundle("~/bundles/styles/app");
      appStyle
        .Include("~/Content/app/index.min.css");
      bundles.Add(appStyle);

      ScriptBundle libScript = new ScriptBundle("~/bundles/scripts/lib");
      libScript
        .Include("~/scripts/lib/jquery/jquery.min.js")        
        .Include("~/scripts/lib/bootstrap/bootstrap.min.js")
        .Include("~/scripts/lib/fastclick/fastclick.min.js")
        .Include("~/scripts/lib/admin/admin.min.js")
        .Include("~/scripts/lib/sparkline/sparkline.min.js")
        .Include("~/scripts/lib/jvectormap/jvectormap.min.js")
        .Include("~/scripts/lib/jvectormap/jvectormap.world.mil.en.min.js")
        .Include("~/scripts/lib/slimscroll/slimscroll.min.js")
        .Include("~/scripts/lib/chartjs/chart.min.js")        
        .Include("~/scripts/lib/admin/pages/dashboard.min.js")
        .Include("~/scripts/lib/admin/demo.min.js")
        .Include("~/scripts/lib/angular/angular.min.js")
        .Include("~/scripts/lib/angular/angular-route.min.js")
        .Include("~/scripts/lib/angular/angular-animate.min.js")
        .Include("~/scripts/lib/angular/angular-resource.min.js");
      bundles.Add(libScript);

      ScriptBundle appScript = new ScriptBundle("~/bundles/scripts/app");
      appScript
        .Include("~/scripts/app/index.min.js")
        .Include("~/scripts/app/services/user.min.js")
        .Include("~/scripts/app/factories/user.min.js")
        .Include("~/scripts/app/directives/grid.min.js")
        .Include("~/scripts/app/controllers/body.min.js");
        bundles.Add(appScript);
    }
  }
}
