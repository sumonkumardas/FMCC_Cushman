using System;
using System.Web;
using System.Text;
using System.Linq;
using System.Web.Security;
using Fmcc.Models.EntityDataModel;
using System.Collections.Generic;

namespace Fmcc.Security
{
    public class CookieManagement
    {
        internal static string GetRolesTicket(User user, FMCCDataContext context)
        {
            var roles = context.UserRoles
                .Where(a => a.UserId == user.Id)
                .Select(a => new
                {
                    RoleId = a.RoleId,
                    RoleName = a.Rolename
                })
                .ToArray();

            var permissionRoleString = "";

            foreach (var role in roles)
            {
                int roleId = role.RoleId;
                string roleName = role.RoleName;

                if (!permissionRoleString.Equals(""))
                {
                    permissionRoleString += ",";
                }

                permissionRoleString += roleName;

                var temp = context.MenuAuthentications.Where(r => r.RoleId == roleId && r.IsAuthorized == true).Select(a => a.PermissionRole).ToArray();
                if (temp.Length != 0)
                {
                    permissionRoleString += "," + string.Join(",", temp.Where(a => !string.IsNullOrEmpty(a)));

                }
            }

            if (user.IsAdministrator == true)
            {
                permissionRoleString += "," + "Administrator";
            }

            return permissionRoleString;
        }

        public static int UserInfoCookieGetUserId(string[] userInfoCookie)
        {
            return Convert.ToInt32(userInfoCookie[2]);
        }

        public static string UserInfoCookieGetUserSessionId(string[] userInfoCookie)
        {
            return userInfoCookie[3].ToString();
        }

        internal static string[] GetUserInfoCookieDecrypted(HttpCookie userInfoCookie)
        {
            var bytes = Convert.FromBase64String(userInfoCookie.Values["u$c"]);
            var output = MachineKey.Unprotect(bytes, "_up");
            string result = Encoding.UTF8.GetString(output);

            string[] userInfos = result.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            return userInfos;
        }

        internal static void SetUserToCookie(User user)
        {
            string userInfo = user.Id + "," + user.Username + "," + user.Password + "," + user.Image;

            HttpCookie securedUserCookie = CreateSecureCookie("user$cookie", "u$c", userInfo, "fmccwebportal", 30);

            HttpContext.Current.Response.Cookies.Add(securedUserCookie);
        }

        internal static void SetUserRolesToCookie(User user, FMCCDataContext context)
        {
            string roleString = string.Empty;

            if (user.IsAdministrator.Value)
            {
                roleString = "Administrator,";
            }

            var roles = context.UserRoles.Where(w => w.UserId == user.Id).Select(s => s.Rolename);

            string userRoles = string.Join(",", roles.Where(w => !string.IsNullOrEmpty(w)).ToArray());

            roleString = roleString + userRoles;

            HttpCookie securedUserCookie = CreateSecureCookie("user$cookie", "r$c", roleString, "fmccwebportal", 30);

            HttpContext.Current.Response.Cookies.Add(securedUserCookie);
        }

        internal static string[] GetUserFromCookie(HttpCookie userCookie)
        {
            byte[] bytes = Convert.FromBase64String(userCookie.Values["u$c"]);
            byte[] data = MachineKey.Unprotect(bytes, "fmccwebportal");
            string result = Encoding.UTF8.GetString(data);
            string[] user = result.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            return user;
        }

        internal static string[] GetUserRolesFromCookie(HttpCookie roleCookie)
        {
            byte[] bytes = Convert.FromBase64String(roleCookie.Values["r$c"]);
            byte[] data = MachineKey.Unprotect(bytes, "fmccwebportal");
            string result = Encoding.UTF8.GetString(data);
            string[] roles = result.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            return roles;
        }

        internal static HttpCookie CreateSecureCookie(string name, string key, string value, string secret, int expire)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(value);
            string encodedCookie = Convert.ToBase64String(MachineKey.Protect(bytes, secret));

            HttpCookie httpCookie = new HttpCookie(name);
            httpCookie.Expires = DateTime.Now.AddMinutes(expire);
            httpCookie.Values.Add(key, encodedCookie);
            return httpCookie;
        }

        public static string UserInfoTicketCreator(string UserName, string Email, int Id, string userSesstionId)
        {
            return UserName + "," + Email + "," + Id + "," + userSesstionId;
        }
    }
}