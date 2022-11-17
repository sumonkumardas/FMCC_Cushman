using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    public class AlertMailModel
    {

        public double? AlertRoleValue { get; internal set; }
        public string AlertText { get; internal set; }
        public double BaselineRange { get; internal set; }
        public double BaselineValue { get; internal set; }
        public int BuildingFkId { get; internal set; }
        public string BuildingName { get; internal set; }
        public int? Condition { get; internal set; }
        public string DatafieldName { get; internal set; }
        public string Email { get; internal set; }
        public string FullName { get; internal set; }
        public bool? IsEmail { get; internal set; }
        public bool? IsSMS { get; internal set; }
        public string MobileNo { get; internal set; }
        public string ObjectName { get; internal set; }
        public double? ReadingValue { get; internal set; }
        public int? Severity { get; internal set; }
        public DateTime? Timestamp { get; internal set; }
        public int UserId { get; internal set; }
    }
}