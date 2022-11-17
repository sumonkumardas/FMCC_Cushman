using Fmcc.Models.EntityDataModel;
using Fmcc.Security;
using log4net;
using log4net.Repository.Hierarchy;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Principal;
using System.Web;
using System.Web.Security;

namespace Fmcc.Extension
{
    public static class Authentication
    {
        //set user cookie to  response using context
        internal static void SetCookie(this HttpContextBase httpContextBase, User appUser, bool rememberMe)
        {
            try
            {
                using (FMCCDataContext dbcontext = new FMCCDataContext())
                {
                    UserData userData = new UserData();
                    userData.Id = appUser.Id;
                    userData.Email = appUser.Email;
                    userData.Username = appUser.Username;
                    userData.Fullname = appUser.FullName;
                    userData.Roles = CookieManagement.GetRolesTicket(appUser, dbcontext);

                    string jsonData = JsonConvert.SerializeObject(userData);

                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, appUser.Username, DateTime.Now, DateTime.Now.AddMinutes(5), rememberMe, jsonData);

                    httpContextBase.Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket)));
                    string[] roles = JsonConvert.DeserializeObject<UserData>(ticket.UserData).Roles.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    httpContextBase.User = new GenericPrincipal(new FormsIdentity(ticket), roles);
                }
            }
            catch (System.Exception exception)
            {
                ILog logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
                logger.Error(exception.Message);
            }

        }
    }
}