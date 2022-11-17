using System;
using System.Linq;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using System.Web;
using System.Web.Security;
using System.Security.Principal;
using Fmcc.Security;
using Fmcc.Models;
using System.Collections.Generic;

namespace Fmcc.Controllers.ServiceControllers
{

    public class DashboardMenuController : ApiBaseController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private readonly FMCCDataContext context;

        public DashboardMenuController()
        {
            context = new FMCCDataContext();
        }

        public object Get(int id = 0)
        {
            object data = new object();
            try
            {
                int userId = UserInfo.Id;
                data = context.DashboardMenus.Where(w => w.UserFkId == userId).OrderBy(o => o.MenuOrder).Select(s => new { text = s.Name, url = "/" + s.UserFkId + "/" + s.Id }).ToList();
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
            }
            return data;
        }

        [HttpPost]
        public object Post(int order, string name)
        {
            DashboardMenu menu = new DashboardMenu
            {
                Name = name,
                UserFkId = UserInfo.Id,
                MenuOrder = order
            };
            try
            {
                var count = context.DashboardMenus.Where(e => e.Name == name && e.UserFkId == UserInfo.Id).SingleOrDefault();
                if (count == null)
                {
                    context.DashboardMenus.Add(menu);
                    context.SaveChanges();
                }
                else
                {
                    return null;
                }

            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
            }
            return new { Id = menu.Id, text = menu.Name, url = "/" + menu.Id };
        }

        [Route("api/dashboardmenu/remove")]
        public Output Remove(DashboardMenu model)
        {
            var result = new Output();
            try
            {
                if (model == null)
                {
                    result.okay = false;
                }
                else
                {
                    if (model.Id > 0)
                    {
                        var menu = context.DashboardMenus.Find(model.Id);
                        var presets = context.DashboardMenuPresets.Where(e => e.MenuFkId == model.Id).ToList();
                        if (menu != null)
                        {
                            context.DashboardMenuPresets.RemoveRange(presets);
                            context.DashboardMenus.Remove(menu);
                            context.SaveChanges();
                            result.okay = true;
                        }
                        else
                        {
                            result.okay = false;
                        }
                    }
                    else
                    {
                        result.okay = false;
                    }
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [Route("api/dashboardmenu/getall")]
        public Output GetAll()
        {
            var result = new Output();
            try
            {
                List<object> list = new List<object>();
                list.Add(new { value = "1", text = "Bangla" });
                list.Add(new { value = "2", text = "English" });
                list.Add(new { value = "3", text = "Mathematics" });
                list.Add(new { value = "4", text = "Goology" });
                list.Add(new { value = "5", text = "Biology" });
                list.Add(new { value = "6", text = "Aerodynamics" });
                list.Add(new { value = "7", text = "Economics" });
                list.Add(new { value = "8", text = "Statistics" });
                list.Add(new { value = "9", text = "Chemestry" });
                list.Add(new { value = "10", text = "Physics" });
                list.Add(new { value = "11", text = "Management" });
                list.Add(new { value = "12", text = "Accounting" });
                list.Add(new { value = "13", text = "Sociology-I" });
                list.Add(new { value = "14", text = "Sociology-II" });
                list.Add(new { value = "15", text = "Sociology-III" });
                list.Add(new { value = "16", text = "Sociology-IV" });
                result.model = list;
                result.okay = true;
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
            }
            return result;
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
