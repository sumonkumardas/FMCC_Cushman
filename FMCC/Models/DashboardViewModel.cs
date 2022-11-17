using System.Web.Mvc;
using System.Collections.Generic;
using Fmcc.Extension;
using Fmcc.Security;

namespace Fmcc.Models
{
    public class DashboardViewModel
    {
        public string UserImage { get; set; }
        public string[] PermissionList { get; set; }
        public List<SelectListItem> UnitList { get; set; }
        public List<TextUrlViewModel> MenuList { get; set; }
        public List<SelectListItem> BuildingList { get; set; }
        public List<SiteModel> SiteList { get; set; }
    }


    public class TextUrlViewModel
    {
        public int id { get; set; }
        public string text { get; set; }
        public string url { get; set; }
    }
}