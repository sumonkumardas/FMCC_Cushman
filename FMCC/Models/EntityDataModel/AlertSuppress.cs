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
    
    public partial class AlertSuppress
    {
        public int Id { get; set; }
        public System.DateTime From_Date { get; set; }
        public System.DateTime to_Date { get; set; }
        public int BuildingFkId { get; set; }
        public string BuildingId { get; set; }
    }
}