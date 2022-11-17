using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models.DTO
{
    public class AlertDTO
    {
        public string Block { get; set; }
        public string Title { get; set; }
        public string DataField { get; set; }
        public string Severity { get; set; }
        public string Timestamp { get; set; }
        public string Condition { get; set; }
        public double ReferenceValue { get; set; }
        public int Status { get; set; }
    }
}