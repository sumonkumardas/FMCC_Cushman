using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    public class AlertAverageSetupModel
    {
        public int Minute { get; set; }
        public int BuildingFkId { get; set; }
        public string BuildingId { get; set; }
    }
}