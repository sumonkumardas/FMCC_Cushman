using Fmcc.Extension;
using Fmcc.Models;
using Fmcc.Models.EntityDataModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Routing;

namespace Fmcc.Controllers.ServiceControllers
{
    [RoutePrefix("api/userrolemanagement")]
    public class UserRoleManagementController : ApiController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private FMCCDataContext context;

        public UserRoleManagementController()
        {
            context = new FMCCDataContext();
        }

        [HttpGet]
        [Route("getusers")]
        public object GetUsers()
        {
            try
            {
                var queryString = Request.GetQueryNameValuePairs().ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
                int draw = int.Parse(queryString["draw"]);
                int start = int.Parse(queryString["start"]);
                int length = int.Parse(queryString["length"]);
                string search = queryString["search.value"];
                var query = context.Users;

                var filteredData = query.Where(e => e.FullName.Contains(search) || e.Username.Contains(search) || e.Designation.Contains(search)).Select(e => e).ToList();
                var data = filteredData.Select(e => new
                {
                    Id = e.Id,
                    FullName = e.FullName,
                    Email = e.Email,
                    Username = e.Username,
                    Password = e.Password,
                    Designation = e.Designation,
                    MobileNo = e.MobileNo,
                    PhoneNo = e.PhoneNo,
                    Image = e.Image,
                }).OrderBy(o => o.FullName).Skip(start).Take(length).ToList();
                return new
                {
                    draw = draw,
                    data = data,
                    recordsFiltered = filteredData.Count,
                    recordsTotal = query.Count()
                };
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet]
        [Route("getuserlist")]
        public object GetUserList()
        {
            var result = new Output();
            try
            {
                var list = context.Users.Select(e => new
                {
                    Id = e.Id,
                    FullName = e.FullName,
                    Email = e.Email,
                    Username = e.Username,
                    Password = e.Password,
                    Designation = e.Designation,
                    MobileNo = e.MobileNo,
                    PhoneNo = e.PhoneNo
                }).ToList();
                result.okay = true;
                result.model = list;
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpPost]
        [Route("setuser")]
        public object SetUser(User user)
        {
            Output output = new Output();
            try
            {
                if (user != null)
                {
                    int count = context.Users.Where(e => e.FullName == user.FullName && e.Email == user.Email && e.Username == user.Username).Count();
                    if (count == 0)
                    {
                        user.Password = ComplexLetterCollection.getTangledLetters(user.Password);
                        context.Users.Add(user);
                        context.SaveChanges();
                        output.okay = true;
                        output.message = string.Empty;
                        output.model = user.Id;
                    }
                    else
                    {
                        output.okay = false;
                        output.message = "Already Exists!";
                    }
                }
                else
                {
                    output.okay = false;
                    output.message = "User not found";
                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
                logger.Error(output.message);
            }
            return output;
        }

        [HttpPost]
        [Route("updateuser")]
        public object UpdateUser(User user)
        {
            Output output = new Output();
            try
            {
                if (user != null)
                {
                    if (user.Id > 0)
                    {
                        User _user = context.Users.Find(user.Id);
                        if (_user != null)
                        {
                            if (_user.Password != user.Password)
                            {
                                _user.Password = ComplexLetterCollection.getTangledLetters(user.Password);
                            }
                            _user.FullName = user.FullName;
                            _user.Email = user.Email;
                            _user.Username = user.Username;
                            _user.Password = user.Password;
                            _user.Designation = user.Designation;
                            _user.MobileNo = user.MobileNo;
                            _user.PhoneNo = user.PhoneNo;
                            context.SaveChanges();
                            output.okay = true;
                            output.message = string.Empty;
                            output.model = _user.Id;
                        }
                        else
                        {
                            output.okay = false;
                            output.message = "User not found";
                        }
                    }
                    else
                    {
                        output.okay = false;
                        output.message = "User not found";
                    }
                }
                else
                {
                    output.okay = false;
                    output.message = "User not found";
                }

            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
        }

        [HttpPost]
        [Route("deleteuser")]
        public object DeleteUser(User user)
        {
            var result = new Output();
            try
            {
                if (user.Id > 0)
                {
                    var _user = context.Users.Find(user.Id);
                    if (_user != null)
                    {
                        var uroles = context.UserRoles.Where(e => e.UserId == user.Id);
                        context.Users.Remove(_user);
                        context.UserRoles.RemoveRange(uroles);
                        context.SaveChanges();
                        string path = "~" + _user.Image;
                        File.Delete(HttpContext.Current.Server.MapPath(path));
                        result.okay = true;
                        result.message = string.Empty;
                    }
                    else
                    {
                        result.okay = false;
                        result.message = "Already Exists!";
                    }
                }
                else
                {
                    result.okay = false;
                    result.message = "Already Exists!";
                }
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpGet]
        [Route("getroles")]
        public object GetRoles()
        {

            var result = new Output();
            try
            {
                var queryString = Request.GetQueryNameValuePairs()
                .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
                int draw = int.Parse(queryString["draw"]);
                int start = int.Parse(queryString["start"]);
                int length = int.Parse(queryString["length"]);
                string search = queryString["search.value"];
                var query = context.Roles;

                var filteredData = query.Where(e => e.Name.Contains(search) || e.Description.Contains(search)).Select(e => new
                {
                    Id = e.Id,
                    Name = e.Name,
                    ExpirationTime = e.ExpirationTime,
                    Description = e.Description
                }).ToList();
                var data = filteredData.OrderBy(o => o.Name).Skip(start).Take(length).ToList();
                return new
                {
                    draw = draw,
                    data = data,
                    recordsFiltered = filteredData.Count,
                    recordsTotal = query.Count()
                };
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet]
        [Route("getrolelist")]
        public object GetRoleList()
        {
            var result = new Output();
            try
            {
                var list = context.Roles.ToList();
                result.okay = true;
                result.model = list;
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpPost]
        [Route("setrole")]
        public object SetRole(Role role)
        {
            var result = new Output();
            try
            {
                int count = context.Roles.Where(e => e.Name == role.Name).Count();
                if (count == 0)
                {
                    role.ExpirationTime = role.ExpirationTime == 0 ? 30 : role.ExpirationTime;
                    role.IsActive = true;
                    context.Roles.Add(role);
                    context.SaveChanges();
                    result.okay = true;
                    result.message = string.Empty;
                }
                else
                {
                    context.Roles.Add(role);
                    context.SaveChanges();
                    result.okay = false;
                    result.message = "Already Exists!";
                }

            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpPost]
        [Route("updaterole")]
        public object UpdateRole(Role role)
        {
            var result = new Output();
            try
            {
                if (role.Id > 0)
                {
                    var _role = context.Roles.Find(role.Id);
                    if (_role != null)
                    {
                        _role.Name = role.Name;
                        _role.Description = role.Description;
                        _role.ExpirationTime = role.ExpirationTime;
                        context.SaveChanges();
                        result.okay = true;
                        result.message = string.Empty;
                    }
                    else
                    {
                        result.okay = false;
                        result.message = string.Empty;
                    }
                }
                else
                {
                    result.okay = false;
                    result.message = "Already Exists!";
                }

            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpPost]
        [Route("deleterole")]
        public object DeleteRole(Role role)
        {
            var result = new Output();
            try
            {
                if (role.Id > 0)
                {
                    var _role = context.Roles.Find(role.Id);
                    if (_role != null)
                    {
                        var uroles = context.UserRoles.Where(e => e.UserId == role.Id);
                        context.Roles.Remove(_role);
                        context.UserRoles.RemoveRange(uroles);
                        context.SaveChanges();
                        result.okay = true;
                        result.message = string.Empty;
                    }
                    else
                    {
                        result.okay = false;
                        result.message = "Already Exists!";
                    }
                }
                else
                {
                    result.okay = false;
                    result.message = "Already Exists!";
                }
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpGet]
        [Route("getuserroles")]
        public object GetUserRoles()
        {

            var result = new Output();
            try
            {
                var queryString = Request.GetQueryNameValuePairs().ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
                int draw = int.Parse(queryString["draw"]);
                int start = int.Parse(queryString["start"]);
                int length = int.Parse(queryString["length"]);
                string search = queryString["search.value"];
                var query = context.UserRoles;

                var filteredData = query.Where(e => e.Rolename.Contains(search) || e.Username.Contains(search)).Select(e => new
                {
                    UserId = e.UserId,
                    RoleId = e.RoleId,
                    Rolename = e.Rolename,
                    Username = e.Username
                }).ToList();
                var data = filteredData.OrderBy(o => o.Rolename).Skip(start).Take(length).ToList();
                return new
                {
                    draw = draw,
                    data = data,
                    recordsFiltered = filteredData.Count,
                    recordsTotal = query.Count()
                };
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpPost]
        [Route("setuserrole")]
        public object SetUserRoles(UserRole userRole)
        {
            var result = new Output();
            try
            {
                int exist = context.UserRoles.Where(w => w.UserId == userRole.UserId && w.RoleId == userRole.RoleId).Count();
                if (exist == 0)
                {

                    var username = context.Users.Find(userRole.UserId);
                    var rolename = context.Roles.Find(userRole.RoleId);
                    var userRoleItem = context.UserRoles.Where(w => w.UserId == userRole.UserId).SingleOrDefault();
                    if (userRoleItem != null)
                    {
                        userRoleItem.IsActive = true;
                        userRoleItem.UserId = username.Id;
                        userRoleItem.Username = username.Username;
                        userRoleItem.Rolename = rolename.Name;
                        userRoleItem.RoleId = rolename.Id;
                        //context.Entry(userRoleItem).State = System.Data.Entity.EntityState.Modified;
                        context.SaveChanges();

                    }
                    else
                    {
                        userRole.IsActive = true;
                        userRole.UserId = username.Id;
                        userRole.Username = username.Username;
                        userRole.Rolename = rolename.Name;
                        userRole.RoleId = rolename.Id;
                        context.UserRoles.Add(userRole);
                        context.SaveChanges();
                    }

                    result.okay = true;
                    result.message = string.Empty;
                }
                else
                {
                    result.okay = false;
                    result.message = "Already Exists!";
                }

            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpPost]
        [Route("deleteuserrole")]
        public Output DeleteUserRole(UserRole userRole)
        {
            var result = new Output();
            try
            {
                var _userRole = context.UserRoles.Where(w => w.UserId == userRole.UserId && w.RoleId == userRole.RoleId).FirstOrDefault();
                if (_userRole != null)
                {
                    context.UserRoles.Remove(_userRole);
                    context.SaveChanges();
                    result.okay = true;
                    result.message = string.Empty;
                }
                else
                {
                    result.okay = false;
                    result.message = "Does not Exists!";
                }
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpPost]
        [Route("Upload")]
        public Output Upload()
        {
            Output output = new Output();
            try
            {
                HttpRequest request = HttpContext.Current.Request;
                int userId = int.Parse(request.Form["Id"]);
                if (userId > 0)
                {
                    HttpPostedFile httpfile = request.Files.Count > 0 ? request.Files[0] : null;
                    if (httpfile != null && httpfile.ContentLength > 0)
                    {
                        string ext = Path.GetExtension(httpfile.FileName);
                        string name = Path.GetFileNameWithoutExtension(httpfile.FileName);
                        string filename = string.Concat(name, userId, ext);
                        string fileDir = "/images/users/";
                        string path = Path.Combine(HttpContext.Current.Server.MapPath(fileDir), filename);
                        httpfile.SaveAs(path);
                        output.okay = true;
                        User user = context.Users.Find(userId);
                        if (user != null)
                        {
                            user.Image = string.Concat(fileDir, filename);
                            context.SaveChanges();
                        }
                        else
                        {
                            output.okay = false;
                            File.Delete(path);
                            output.message = "User not found";
                        }
                    }
                    else
                    {
                        output.okay = false;
                        output.message = "Invalid File.";
                    }
                }
                else
                {
                    output.okay = false;
                    output.message = "User not provided.";
                }
            }
            catch (Exception ex)
            {
                output.okay = false;
                logger.Error(ex.Message);
                output.message = ex.Message;
            }
            return output;
        }
    }
}
