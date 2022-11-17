using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Fmcc.Models.EntityDataModel;

namespace Fmcc.Models.DTO
{
    public class AMRPowerConsumptionBlockViewReportModel
    {
        public List<AMRDataBlockView> Previous { get; set; }
        public List<AMRDataBlockView> Last { get; set; }
        public List<string> XCategories { get; set; }
        public string Unit { get; set; }
        public string TotalPowerConsumptionLastLabel { get; set; }
        public double TotalPowerConsumptionLast { get; set; }
        public double TotalPowerConsumptionPrevious { get; set; }
        public double TotalPowerConsumptionUpgradePercentage { get; set; }
        public double LastPeak { get; set; }
        public double LastAverage { get; set; }
        public string BiggestIncreaseLastLabel { get; set; }
        public decimal BiggestIncreaseLast { get; set; }
        public decimal BiggestIncreasePrevious { get; set; }
        public decimal BiggestIncreaseUpgradePercentage { get; set; }
        public string BiggestDecreaseLastLabel { get; set; }
        public decimal BiggestDecreaseLast { get; set; }
        public decimal BiggestDecreasePrevious { get; set; }
        public decimal BiggestDecreaseUpgradePercentage { get; set; }
    }
}