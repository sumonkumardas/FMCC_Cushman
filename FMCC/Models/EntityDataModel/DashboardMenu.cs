//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Fmcc.Models.EntityDataModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class DashboardMenu
    {
        public int Id { get; set; }
        public string MenuId { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        public Nullable<int> UserFkId { get; set; }
        public string UrlPath { get; set; }
        public Nullable<int> MenuOrder { get; set; }
    }
}
