using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    public class AlertDataResult
    {
        public int blFkId { get; internal set; }
        public string objName { get; internal set; }

        public string AlertText { get; internal set; }
        public string BaselineRange { get; internal set; }
        public string BaselineValue { get; internal set; }
        public string BuildingName { get; internal set; }
        public string Condition { get; internal set; }
        public string DataFieldName { get; internal set; }
        public string Email { get; internal set; }
        public string FullName { get; internal set; }
        public bool IsEmail { get; internal set; }
        public bool? IsSMS { get; internal set; }
        public string MobileNo { get; internal set; }
        public double AlertRoleValue { get; internal set; }
        public double ReadingValue { get; internal set; }
        public string Severity { get; internal set; }
        public DateTime? Timestamp { get; internal set; }
        public int UserId { get; internal set; }
        public string Id { get; internal set; }
        public string RoleId { get; internal set; }
    }
}