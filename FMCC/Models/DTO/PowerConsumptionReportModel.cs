using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Fmcc.Models.EntityDataModel;

namespace Fmcc.Models.DTO
{
    public class PowerConsumptionReportModel
    {
        public List<DayData> Previous { get; set; }
        public List<DayData> Last { get; set; }
        public string Unit { get; set; }
    }
}