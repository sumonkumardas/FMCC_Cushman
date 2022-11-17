using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Fmcc.Models.EntityDataModel;

namespace Fmcc.Models.DTO
{
    public class PowerConsumptionReportDashboardDataDTO
    {
        public double TotalValue { get; set; }
        public string LowestBlockName { get; set; }
        public double LowestBlockValue { get; set; }
        public string HighestBlockName { get; set; }
        public double HighestBlockValue { get; set; }
        public string Unit { get; set; }
    }
}