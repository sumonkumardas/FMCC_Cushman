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
    
    public partial class Site
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public Nullable<decimal> Latitude { get; set; }
        public Nullable<decimal> Longitude { get; set; }
        public string ImageLocation { get; set; }
        public Nullable<bool> Active { get; set; }
    }
}
