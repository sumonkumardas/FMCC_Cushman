using System;
using System.Linq;
using Fmcc.Models;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using System.Collections.Generic;


namespace Fmcc.Controllers.ServiceControllers
{

    [RoutePrefix("api/admin")]
    public class AdminController : ApiController
    {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private FMCCDataContext context;

        public AdminController()
        {
            context = new FMCCDataContext();
        }

        [HttpGet]
        [Route("getrolelist")]
        public Output GetRoleList()
        {
            Output output = new Output();
            try
            {
                var list = context.Roles.Select(e => new { id = e.Id, text = e.Name }).ToList();
                output.okay = true;
                output.model = list;
                output.message = string.Empty;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.model = null;
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
        }

        [HttpGet]
        [Route("getmodulelist")]
        public Output GetModuleList()
        {
            Output output = new Output();
            try
            {
                var list = context.Modules.Select(e => new { id = e.Id, text = e.Name }).ToList();
                output.okay = true;
                output.model = list;
                output.message = string.Empty;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.model = null;
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
        }

        [HttpGet]
        [Route("getmenulist")]
        public object GetMenuList(int role = 0, int moduleId = 0)
        {
            Output output = new Output();
            try
            {
                if (context.MenuAuthentications.Where(w => w.RoleId == role && w.ModuleId == moduleId).Any())
                {
                    output.model = context.MenuAuthentications
                        .Where(w => w.RoleId == role && w.ModuleId == moduleId)
                        .Join(context.Menus, menuauth => menuauth.MenuId, menu => menu.Id, (x, y) => new
                        {
                            Id = x.Id,
                            Url = y.Url,
                            Parent = y.Parent,
                            MenuItem = y.MenuItem,
                            IsAuthorized = x.IsAuthorized,
                            PermissionRole = y.PermissionRole,
                            RoleId = x.RoleId,
                            ModuleId = y.ModuleId,
                            MenuId = y.Id,
                        }).ToList();
                }
                else
                {
                    output.model = context.Menus.Where(w => w.ModuleId == moduleId).Select(s => new
                    {
                        Id = 0,
                        Url = s.Url,
                        Parent = s.Parent,
                        MenuItem = s.MenuItem,
                        IsAuthorized = false,
                        PermissionRole = s.PermissionRole,
                        RoleId = role,
                        ModuleId = moduleId,
                        MenuId = s.Id,
                    }).ToList();
                }
                output.okay = true;
                output.message = string.Empty;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.model = null;
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
        }

        [HttpPost]
        [Route("setmenulist")]
        public object SetMenuList(List<MenuAuthentication> model)
        {
            Output output = new Output();
            try
            {
                foreach (var item in model)
                {
                    if (item.Id > 0)
                    {
                        var menu = context.MenuAuthentications.Find(item.Id);
                        menu.IsAuthorized = item.IsAuthorized;
                        context.SaveChanges();
                    }
                    else if (item.Id == 0)
                    {
                        context.MenuAuthentications.Add(item);
                        context.SaveChanges();
                    }

                }

                output.okay = true;
                output.message = string.Empty;
                output.model = model;

            }
            catch (Exception exception)
            {
                output.okay = false;
                output.model = null;
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
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
