using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    public class AlertDescription
    {
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
        public string Severity { get; set; }
        public string DataPoint { get; set; }
        public string LastRecord { get; set; }
        public double ReferenceValue { get; set; }
        public string Rule { get; set; }
    }
}