using System;
using System.Web;
using Fmcc.Models;
using System.Linq;
using Fmcc.Security;
using System.Web.Mvc;
using System.Web.Security;
using System.Collections.Generic;
using Fmcc.Models.EntityDataModel;
using Newtonsoft.Json;

namespace Fmcc.Controllers
{
    public class HomeController : BaseController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private FMCCDataContext context;

        public HomeController()
        {
            context = new FMCCDataContext();
            
        }

        public ActionResult Index()
        {
            
            DashboardViewModel model = new DashboardViewModel();
            try
            {

                List<SelectListItem> unitList = context.DataFields.Select(s => s.Unit).Distinct().Select(e => new SelectListItem { Text = e.Trim(), Value = e.Trim() }).ToList();
                List<SelectListItem> buildingList = context.Buildings.Distinct().Select(e => new SelectListItem { Text = e.Name.Trim(), Value = e.BuildingId.Trim() }).ToList();

                string[] permissionList = UserInfo.Roles.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                if (permissionList.Contains("MyDashboardRolePermission") || permissionList.Contains("Administrator"))
                {
                    int userId = UserInfo.Id;
                    if (userId > 0)
                    {
                        model.MenuList = context.DashboardMenus.Where(w => w.UserFkId == userId).OrderBy(o => o.MenuOrder).Select(s => new TextUrlViewModel { id = s.Id, text = s.Name, url = "#/mydashboard/" + s.Id }).ToList();
                    }
                }

                model.UserImage = getImage();
                model.UnitList = unitList;
                model.BuildingList = buildingList;
                model.PermissionList = permissionList;
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return View("ErrorPage", new { Message = exception.Message });
            }

            DisableBrowserCaching();
            return View(model);
        }

        public ActionResult Site()
        {
            return View();
        }

        private void DisableBrowserCaching()
        {
            try
            {
                Response.Cache.SetNoStore();
                Response.Cache.SetNoServerCaching();
                Response.Cache.SetExpires(DateTime.Now);
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);

            }


        }

        private string getImage()
        {
            try
            {
                string image = string.Empty;
                var user = context.Users.Find(UserInfo.Id);
                if (user != null)
                {
                    image = string.IsNullOrEmpty(user.Image) ? "/images/users/user.png" : user.Image;
                }
                else
                {
                    image = "/images/users/user.png";
                }

                return image;
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;

            }
           
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (context != null)
                {
                    context.Dispose();
                }
            }
            base.Dispose(disposing);
        }
    }
}