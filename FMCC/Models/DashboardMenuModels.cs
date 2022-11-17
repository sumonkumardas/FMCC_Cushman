using Fmcc.Extension;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{

    public class Menu { }
    public class Preset
    {
        public int id { get; set; }

        public int? order { get; set; }

        public string unit { get; set; }
        public string userId { get; set; }
        public int? userFkId { get; set; }

        public string menuId { get; set; }
        public int? menuFkId { get; set; }

        public int? blockFkId { get; set; }
        public string blockId { get; set; }
        public string blockText { get; set; }

        public int? objectFkId { get; set; }
        public string objectId { get; set; }
        public string objectText { get; set; }

        public string dateFlag { get; set; }
        public string dateFlagText { get; set; }

        public string chartType { get; set; }
        public string chartTitle { get; set; }
        public string chartTypeText { get; set; }

        public int? dataFieldFkId { get; set; }
        public string dataFieldId { get; set; }
        public string dataFieldText { get; set; }

        public string displayProfile { get; set; }

        public int? objectToCompareFkId { get; set; }
        public string objectToCompareId { get; set; }
        public string objectToCompareText { get; set; }

        public int? dataFieldToCompareFkId { get; set; }
        public string dataFieldToCompareId { get; set; }
        public string dataFieldToCompareText { get; set; }
        public string RATemperature { get; set; }
        public string ValveOutput { get; set; }
        public Nullable<double> ThresholdRangeFrom { get; set; }
        public Nullable<double> ThresholdRangeTo { get; set; }
        public Nullable<double> TemperatureSetPoint { get; set; }
    }

    public class DateRange
    {
        private int Day = DateTime.Now.Day;
        private int Year = DateTime.Now.Year;
        private int Month = DateTime.Now.Month;
        private int Week = (int)DateTime.Now.DayOfWeek;

        public Range Today
        {
            get
            {
                var range = new Range();
                range.From = DateTime.Now.Date;
                range.To = DateTime.Now;
                return range;
            }
        }
        public Range Yesterday
        {
            get
            {
                var range = new Range();
                range.From = new DateTime(Year, Month, Day, 0, 0, 0).AddDays(-1);
                range.To = new DateTime(Year, Month, Day, 23, 59, 59).AddDays(-1);
                return range;
            }
        }
        public Range ThisWeek
        {
            get
            {
                var range = new Range();
                range.From = DateTime.Now.StartOfWeek(DayOfWeek.Monday).Date;
                range.To = DateTime.Now;
                return range;
            }
        }
        public Range LastWeek
        {
            get
            {
                var range = new Range();
                range.From = DateTime.Now.StartOfWeek(DayOfWeek.Monday).Date.AddDays(-7);
                range.To = DateTime.Now.StartOfWeek(DayOfWeek.Monday).Date.AddSeconds(-1);
                return range;
            }
        }
        public Range ThisMonth
        {
            get
            {
                var range = new Range();
                range.From = new DateTime(Year, Month, 1, 0, 0, 0);
                range.To = DateTime.Now;
                return range;
            }
        }
        public Range LastMonth
        {
            get
            {
                var range = new Range();
                range.From = new DateTime(Year, Month, 1, 0, 0, 0).AddMonths(-1);
                var to = range.From.AddMonths(1).AddSeconds(-1);
                range.To = to;
                return range;
            }
        }
        public Range ThisYear
        {
            get
            {
                var range = new Range();
                range.From = new DateTime(Year, 1, 1, 0, 0, 0);
                range.To = DateTime.Now;
                return range;
            }
        }
        public Range LastYear
        {
            get
            {
                var range = new Range();
                range.From = new DateTime(Year, 1, 1, 0, 0, 0).AddYears(-1);
                range.To = new DateTime(Year, 12, 31, 23, 59, 59).AddYears(-1);
                return range;
            }
        }
    }

    public class Range
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }

}