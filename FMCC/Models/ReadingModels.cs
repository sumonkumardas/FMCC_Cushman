using Fmcc.Extension;
using System;
using System.Collections.Generic;
namespace Fmcc.Extension
{
    public class DbReading
    {
        public double Sum { get; set; }
        public string Key { get; set; }
        public double Avg { get; internal set; }
    }
    public class MyTempReading
    {
        public OverallReading Overall { get; set; }
        public List<IndividualReading> Individual { get; set; }

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Unit { get; set; }
    }
    public class OverallReading : IndividualReading
    {
        public OverallReading()
        {

        }

        public double Total { get; set; }
        public double TotalCompare { get; set; }
        public double ForeCast { get; set; }
        public double ForeCastCompare { get; set; }
        public double PreviousTotal { get; set; }
        public double PreviousForeCast { get; set; }
        public BuildingValueModel Maximum { get; set; }
        public BuildingValueModel Minimum { get; set; }
    }
    public class IndividualReading
    {
        public IndividualReading()
        {
            BuildingId = "all";
        }
        public IndividualReading(string block)
        {
            BuildingId = block;
        }
        public double Average { get; set; }
        public List<DbReading> Reading { get; set; }
        public string BuildingId { get; private set; }

    }

    public class DatePartBlockValue
    {
        public double Value { get; set; }
        public int? DatePart { get; set; }
        public string BuildingId { get; set; }
    }
    //ObjectDataFieldPeriod
    public class ObjectDataFieldPeriod
    {
        public string[] Object { get; set; }
        public string Period { get; set; }
        public string[] DataField { get; set; }

        public DateTimeRange CurrentPeriod { get; set; }
        public DateTimeRange PreviousPeriod { get; set; }

        public double TotalHours { get; set; }
        public double PreviousTotalHours { get; set; }
    }

}