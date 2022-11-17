using System;
using System.Web;
using Fmcc.Models;
using System.Linq;
using Fmcc.Security;
using System.Web.Mvc;
using System.Web.Security;
using System.Collections.Generic;
using Fmcc.Extension;
using Fmcc.Models.EntityDataModel;
using Newtonsoft.Json;

namespace Fmcc.Controllers
{
    public class NewHomeController : BaseController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private FMCCDataContext context;

        public NewHomeController()
        {
            context = new FMCCDataContext();
            
        }

        public ActionResult Index()
        {
            
            DashboardViewModel model = new DashboardViewModel();
            try
            {
                List<SiteModel> listSites = context.Sites.Select(e => new SiteModel(){ Id = e.Id, Name = e.Name, Address = e.Address, Longitude = e.Longitude, Lattitude = e.Latitude, ImageLocation = e.ImageLocation, Active  = e.Active}).ToList();
                List<SelectListItem> unitList = context.DataFields.Select(s => s.Unit).Distinct().Select(e => new SelectListItem { Text = e.Trim(), Value = e.Trim() }).ToList();
                List<SelectListItem> buildingList = context.Buildings.Distinct().OrderBy(building => building.Id).Select(e => new SelectListItem { Text = e.ShortName.Trim(), Value = e.Id.ToString(), Selected = (e.Type == 1) }).ToList();

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
                model.SiteList = listSites;
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return View("ErrorPage", new { Message = exception.Message });
            }

            DisableBrowserCaching();
            return View(model);
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