using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    public class AlertDataModel
    {
        public string BuildingName { get; set; }
        public List<AlertDescription> Alerts { get; set; }
        public List<string> Emails { get; set; }
    }
}