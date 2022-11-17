using System;
using System.Web;
using Fmcc.Models;
using System.Linq;
using Fmcc.Security;
using System.Web.Mvc;
using Fmcc.Extension;
using Newtonsoft.Json;
using System.Web.Security;
using System.Security.Principal;
using Fmcc.Models.EntityDataModel;


namespace Fmcc.Controllers
{
    public class AccountController : BaseController
    {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private FMCCDataContext context;

        public AccountController()
        {
            context = new FMCCDataContext();
        }

        [AllowAnonymous]
        public ActionResult LogIn()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult LogIn(LogInModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    User appUser = null;
                    model.Email = model.Email.ToLower();
                    try
                    {
                        appUser = context.Users.Where(w => w.Email.ToLower() == model.Email).Select(s => s).SingleOrDefault();
                    }
                    catch (Exception exepception)
                    {
                        ViewBag.message = exepception.Message;
                        logger.Error(exepception.Message);
                    }

                    if (appUser != null)
                    {
                        string password = ComplexLetterCollection.getEntangledLetters(appUser.Password);
                        if (model.Password == password)
                        {
                            Authentication.SetCookie(Request.RequestContext.HttpContext, appUser, false);
                            return RedirectToAction("Index", "NewHome");
                        }
                        else
                        {
                            ViewBag.message = "Incorrect Credentials!";
                            return View(model);
                        }
                    }
                    else
                    {
                        ViewBag.message = "Invalid Login";
                        return View(model);
                    }
                }
                else
                {
                    ViewBag.message = "Invalid Login";
                    return View(model);
                }
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return View(model);
            }
        }

        [AllowAnonymous]
        public ActionResult BrowseCustomUrlWithDefaultLogin(string url)
        {
            User appUser = new User();
            appUser.Username = "admin";
            appUser.Password = "123456";

            Authentication.SetCookie(Request.RequestContext.HttpContext, appUser, false);
            return Redirect(HttpUtility.UrlDecode(url));
        }

        public ActionResult LogOut()
        {
            try
            {

                Session.Clear();
                Session.Abandon();
                FormsAuthentication.SignOut();
                return RedirectToAction("LogIn", "Account");
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return RedirectToAction("LogIn", "Account");
            }

        }

        public object GetUserRolePermissions()
        {

            try
            {
                if (HttpContext.User != null)
                {
                    if (HttpContext.User.Identity.IsAuthenticated)
                    {
                        if (HttpContext.User.Identity is FormsIdentity)
                        {
                            FormsIdentity id = HttpContext.User.Identity as FormsIdentity;
                            FormsAuthenticationTicket ticket = id.Ticket;
                            string userData = ticket.UserData;
                            return JsonConvert.DeserializeObject<UserData>(ticket.UserData).Roles;
                        }
                        return null;
                    }
                    return null;
                }
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);

                return null;

            }

            return null;
        }

        private void SetAuthenticationCookie(User user, bool isRemember)
        {
            try
            {
                int expirationTime = GetExpirationTimeFor(user);
                expirationTime = expirationTime > 0 ? expirationTime : 30;
                UserData userData = new UserData();
                userData.Id = user.Id;
                userData.Email = user.Email;
                userData.Username = user.Username;
                userData.Fullname = user.FullName;
                userData.Roles = CookieManagement.GetRolesTicket(user, context);

                string jsonData = JsonConvert.SerializeObject(userData);

                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, user.Username, DateTime.Now, DateTime.Now.AddMinutes(expirationTime), isRemember, jsonData);

                HttpContext.Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket)));

                string[] roles = JsonConvert.DeserializeObject<UserData>(ticket.UserData).Roles.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                HttpContext.User = new GenericPrincipal(new FormsIdentity(ticket), roles);
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);

            }


        }

        private int GetExpirationTimeFor(User user)
        {
            try
            {
                var roleIdObje = context.UserRoles.Where(u => u.UserId == user.Id).Select(u => new { roleId = u.RoleId }).First();

                var ExpirationTime = context.Roles.Where(r => r.Id == roleIdObje.roleId).Select(t => new
                {
                    Data = t.ExpirationTime
                }).FirstOrDefault();

                return (int)ExpirationTime.Data;
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return 0;
            }
        }

        private string GetRedirectUrl(string returnUrl)
        {
            // entered data in userlog table
            //UserSignInSignOutLog(int.Parse(Session["userid"].ToString()), Session["useremail"].ToString(), "Sign In");

            //if (string.IsNullOrEmpty(returnUrl) || !Url.IsLocalUrl(returnUrl))
            //{
            //    return Url.Action("dashboard", "Home");
            //}
            return returnUrl ?? "/";
        }

        internal void DeleteCookie(string cookieName)
        {
            try
            {
                if (Request.Cookies[cookieName] != null)
                {
                    HttpCookie userInfoCookie = new HttpCookie(cookieName);
                    userInfoCookie.Expires = DateTime.Now;
                    Response.Cookies.Add(userInfoCookie);
                }
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
            }
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
