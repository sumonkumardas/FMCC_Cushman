using System;
using System.Collections.Generic;

namespace Fmcc.Models
{
    public class AlertRuleSetupModel
    {
        public int Id { get; set; }
        public string AlertText { get; set; }
        public string Remarks { get; set; }
        public Nullable<int> BuildingFkId { get; set; }
        public string BuildingId { get; set; }
        public Nullable<int> ObjectFkId { get; set; }
        public string ObjectId { get; set; }
        public Nullable<int> DataFieldFkId { get; set; }
        public string DataFieldId { get; set; }
        public Nullable<int> Condition { get; set; }
        public Nullable<double> ThresholdValue { get; set; }
        public Nullable<int> Severity { get; set; }
        public Nullable<double> ReferenceValue { get; set; }
        public Nullable<bool> FixedRuleByFMCC { get; set; }
        public Nullable<bool> IsEmail { get; set; }
        public Nullable<bool> IsSMS { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public string IPAddress { get; set; }
        public List<int> AlertNotifyUser { get; set; }
        public string SelectedDataIds { get; set; }
        public Nullable<double> Percentage { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public string WeekDays { get; set; }
        public Nullable<int> Type { get; set; }
    }
}