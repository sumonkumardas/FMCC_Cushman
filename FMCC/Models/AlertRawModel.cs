using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    public class AlertRawModel
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Severity { get; set; }
        public string BuildingName { get; set; }
        public string ObjectName { get; set; }
        public string DatafieldName { get; set; }
        public double LastRecord { get; set; }
        public double ReferenceValue { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Rule { get; set; }
    }
}