using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    public class AlertModel
    {
        public int AlertRuleId { get; set; }
        public int BuildingFkId { get; set; }
        public string BuildingId { get; set; }
        public int ObjetFkId { get; set; }
        public string ObjetId { get; set; }
        public int DataFieldFkId { get; set; }
        public string DataFieldId { get; set; }
        public System.DateTime FromDateTime { get; set; }
        public System.DateTime ToDateTime { get; set; }
        public string Severity { get; set; }
        public double AlertValue { get; set; }
        public double ReferenceValue { get; set; }
        public string LastRecord { get; set; }
        public string AlertCondition { get; set; }
        public int FMCCStatus { get; set; }
        public bool IsSMS { get; set; }
        public bool IsEmail { get; set; }
        public bool IsActive { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
    }
}