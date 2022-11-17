
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    public class AlertProcessingInput
    {
        public int AlertRuleId { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
    }
}