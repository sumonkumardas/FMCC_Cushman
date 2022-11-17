using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Fmcc.Models.EntityDataModel;

namespace Fmcc.Models.DTO
{
    public class AMRDashboardReportModel
    {
        public Nullable<decimal> HistoricPeakPower { get; set; }
        public Nullable<decimal> HistoricAveragePeakPower { get; set; }
        public Nullable<decimal> PowerYesterdayValue { get; set; }
        public Nullable<decimal> PowerDayBeforeYesterdayValue { get; set; }
        public Nullable<decimal> HistoricPeakPowerIncreasePercentage { get; set; }
        public List<Nullable<double>> PowerDayNdayValue { get; set; }
        public List<string> PowerDayNDates { get; set; }
        public Nullable<decimal> HistoricPeakPowerBill { get; set; }
        public Nullable<decimal> HistoricAveragePeakPowerBill { get; set; }
        public Nullable<decimal> PowerYesterdayValueBill { get; set; }
        public Nullable<decimal> PowerDayBeforeYesterdayValueBill { get; set; }
        public Nullable<decimal> HistoricPeakPowerBillIncreasePercentage { get; set; }
        public List<Nullable<double>> PowerBillDayNdayValue { get; set; }
        public List<string> PowerBillDayNDates { get; set; }


        public Nullable<decimal> HistoricPeakWater { get; set; }
        public Nullable<decimal> WaterYesterdayValue { get; set; }
        public Nullable<decimal> WaterDayBeforeYesterdayValue { get; set; }
        public Nullable<decimal> HistoricPeakWaterIncreasePercentage { get; set; }
        public Nullable<decimal> HistoricPeakWaterBill { get; set; }
        public Nullable<decimal> WaterYesterdayValueBill { get; set; }
        public Nullable<decimal> WaterDayBeforeYesterdayValueBill { get; set; }
        public Nullable<decimal> HistoricPeakWaterBillIncreasePercentage { get; set; }


        public Nullable<decimal> HistoricPeakCO2 { get; set; }
        public Nullable<decimal> CO2YesterdayValue { get; set; }
        public Nullable<decimal> CO2DayBeforeYesterdayValue { get; set; }
        public Nullable<decimal> HistoricPeakCO2IncreasePercentage { get; set; }
        public Nullable<decimal> HistoricPeakCO2Bill { get; set; }
        public Nullable<decimal> CO2YesterdayValueBill { get; set; }
        public Nullable<decimal> CO2DayBeforeYesterdayValueBill { get; set; }
        public Nullable<decimal> HistoricPeakCO2BillIncreasePercentage { get; set; }
    }

    public class DataDTO
    {
        public Nullable<DateTime> Date { get; set; }
        public Nullable<decimal> Value { get; set; }
    }
}