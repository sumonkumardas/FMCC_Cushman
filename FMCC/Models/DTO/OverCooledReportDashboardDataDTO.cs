using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models.DTO
{
    public class OverCooledReportDashboardDataDTO
    {
        public int Block { get; set; }
        public double LowestTemperature { get; set; }
        public int Equipement { get; set; }
        public int DayCount { get; set; }
        public string Unit { get; set; }
    }
}