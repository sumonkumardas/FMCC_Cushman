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
    
    public partial class AlertData
    {
        public int Id { get; set; }
        public Nullable<int> AlertRuleSetupId { get; set; }
        public Nullable<int> BuildingFkId { get; set; }
        public string BuildingId { get; set; }
        public Nullable<int> ObjectFkId { get; set; }
        public string ObjectId { get; set; }
        public Nullable<int> DataFieldFkId { get; set; }
        public string DataFieldId { get; set; }
        public Nullable<double> ReadingValue { get; set; }
        public Nullable<double> ReferencValue { get; set; }
        public Nullable<System.DateTime> Timestamp { get; set; }
        public Nullable<int> Severity { get; set; }
        public Nullable<int> Condition { get; set; }
        public Nullable<bool> IsEmail { get; set; }
        public Nullable<bool> IsSMS { get; set; }
        public Nullable<bool> IsProcess { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public string IPAddress { get; set; }
    }
}
