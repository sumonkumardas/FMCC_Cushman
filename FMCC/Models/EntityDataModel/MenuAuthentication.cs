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
    
    public partial class MenuAuthentication
    {
        public int Id { get; set; }
        public Nullable<int> ModuleId { get; set; }
        public Nullable<int> RoleId { get; set; }
        public Nullable<int> MenuId { get; set; }
        public Nullable<bool> IsAuthorized { get; set; }
        public string PermissionRole { get; set; }
    }
}
