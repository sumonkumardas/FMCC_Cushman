using System;
using System.Linq;
using Fmcc.Extension;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using System.Collections.Generic;


namespace Fmcc.Controllers.ServiceControllers
{
    public class WidgetDataController : ApiController
    {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private FMCCDataContext context;

        public WidgetDataController()
        {
            context = new FMCCDataContext();
        }

        [HttpGet, Route("service/widgetdata/plain")]
        public object Plain(string blockId, string objectId, string dataFieldId, string dateFlag)
        {

            try
            {
                DateRange dateRange = new DateRange();
                Range range = new Range();
                switch (dateFlag)
                {
                    case "today":
                        range = dateRange.Today;
                        break;
                    case "yesterday":
                        range = dateRange.Yesterday;
                        break;
                    case "thisweek":
                        range = dateRange.ThisWeek;
                        break;
                    case "lastweek":
                        range = dateRange.LastWeek;
                        break;
                    case "thismonth":
                        range = dateRange.ThisMonth;
                        break;
                    case "lastmonth":
                        range = dateRange.LastMonth;
                        break;
                    case "thisyear":
                        range = dateRange.ThisYear;
                        break;
                    case "lastyear":
                        range = dateRange.LastYear;
                        break;
                    default:
                        dateFlag = dateFlag.Trim();
                        var dates = dateFlag.Split('-');
                        range.From = new DateTime(int.Parse(dates[0]), int.Parse(dates[1]), int.Parse(dates[2]), 0, 0, 0);
                        range.To = new DateTime(int.Parse(dates[3]), int.Parse(dates[4]), int.Parse(dates[5]), 23, 59, 59);
                        break;
                }

                var list = context.TempReadings.Where(w => w.BuildingId.Equals(blockId) && w.ObjectId.Equals(objectId) && w.DataFieldId.Equals(dataFieldId) && w.Timestamp >= range.From && w.Timestamp <= range.To).OrderBy(o => o.Timestamp)
                    .Select(s => new
                    {
                        YY = s.Timestamp.Year,
                        MM = s.Timestamp.Month - 1,
                        DD = s.Timestamp.Day,
                        hh = s.Timestamp.Hour,
                        mm = s.Timestamp.Minute,
                        ss = s.Timestamp.Second,
                        value = s.Value
                    }).ToList();
                return list;
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet, Route("service/widgetdata/heatmap")]
        public object HeatMap(string blockId, string objectId, string dataFieldId, string dateFlag)
        {
            DateRange dateRange = new DateRange();
            Range range = new Range();

            try
            {
                switch (dateFlag)
                {
                    case "today":
                        range = dateRange.Today;
                        break;
                    case "yesterday":
                        range = dateRange.Yesterday;
                        break;
                    case "thisweek":
                        range = dateRange.ThisWeek;
                        break;
                    case "lastweek":
                        range = dateRange.LastWeek;
                        break;
                    case "thismonth":
                        range = dateRange.ThisMonth;
                        break;
                    case "lastmonth":
                        range = dateRange.LastMonth;
                        break;
                    case "thisyear":
                        range = dateRange.ThisYear;
                        break;
                    case "lastyear":
                        range = dateRange.LastYear;
                        break;
                    default:
                        dateFlag = dateFlag.Trim();
                        var dates = dateFlag.Split('-');
                        range.From = new DateTime(int.Parse(dates[0]), int.Parse(dates[1]), int.Parse(dates[2]), 0, 0, 0);
                        range.To = new DateTime(int.Parse(dates[3]), int.Parse(dates[4]), int.Parse(dates[5]), 23, 59, 59);
                        break;
                }

                var list = (from m in context.TempReadings
                            where m.BuildingId.Equals(blockId) && m.ObjectId.Equals(objectId) && m.DataFieldId.Equals(dataFieldId) && m.Timestamp >= range.From && m.Timestamp <= range.To
                            group m by m.Timestamp.Hour into g
                            select g).ToList();

                var plist = new List<object>();
                for (int i = 0; i < list.Count; i++)
                {
                    var _list = list[i];
                    var _pkey = list[i].Key;
                    var _slist = _list.OrderBy(e => e.Timestamp).GroupBy(e => e.Timestamp.Date).Select(s => s).ToList();
                    for (int j = 0; j < _slist.Count; j++)
                    {
                        plist.Add(new
                        {
                            x = i,
                            y = j,
                            yc = _slist[j].Key.ToString("dd-MM-yyyy"),
                            p = _slist[j].Select(e => e.Value).DefaultIfEmpty(0).Average()
                        });
                    }
                }
                return plist;
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpPost]
        [Route("api/widgetdata/onoffprofiledata")]
        public object OnOffProfileData(widgetParamModel model)
        {
            int onval = 1;
            int offval = 2;
            var onoffData =
                context.ObjectOnOffMappings.FirstOrDefault(
                    x => x.DataFieldId == model.dataFieldId && x.ObjectId == model.objectId);

            DateRange dateRange = new DateRange();
            Range range = new Range();

            try
            {
                switch (model.dateFlag)
                {
                    case "today":
                        range = dateRange.Today;
                        break;
                    case "yesterday":
                        range = dateRange.Yesterday;
                        break;
                    case "thisweek":
                        range = dateRange.ThisWeek;
                        break;
                    case "lastweek":
                        range = dateRange.LastWeek;
                        break;
                    case "thismonth":
                        range = dateRange.ThisMonth;
                        break;
                    case "lastmonth":
                        range = dateRange.LastMonth;
                        break;
                    case "thisyear":
                        range = dateRange.ThisYear;
                        break;
                    case "lastyear":
                        range = dateRange.LastYear;
                        break;
                    default:
                        model.dateFlag = model.dateFlag.Trim();
                        var dates = model.dateFlag.Split('-');
                        range.From = new DateTime(int.Parse(dates[0]), int.Parse(dates[1]), int.Parse(dates[2]), 0, 0, 0);
                        range.To = new DateTime(int.Parse(dates[3]), int.Parse(dates[4]), int.Parse(dates[5]), 23, 59, 59);
                        break;
                }
                var lowestPoint = (onoffData.Type == 1) ? 0 : onoffData.Thresold;
                var highestPoint = (onoffData.Type == 1) ? 2 : onoffData.Thresold+1;
                var list = (from m in context.TempReadings
                            where m.BuildingId.Equals(model.blockId) && m.ObjectId.Equals(model.objectId) && m.DataFieldId.Equals(model.dataFieldId) && m.Timestamp >= range.From && m.Timestamp <= range.To && (m.Value >= lowestPoint.Value && m.Value <highestPoint.Value)
                            group m by m.Timestamp.Hour into g
                            select g).ToList();

                var plist = new List<object>();
                for (int i = 0; i < list.Count; i++)
                {
                    var _list = list[i];
                    var _pkey = list[i].Key;
                    var _slist = _list.OrderBy(e => e.Timestamp).GroupBy(e => e.Timestamp.Date).Select(s => s).ToList();
                    for (int j = 0; j < _slist.Count; j++)
                    {
                        int zeroes = 0;//_slist[j].Where(w => w.Value == 1).Count();
                        int nonZeroes = 0; //_slist[j].Where(w => w.Value == 2).Count();
                        if (onoffData.Type == 1)
                        {
                             zeroes = _slist[j].Where(w => w.Value == onoffData.OffValue.Value).Count();
                             nonZeroes = _slist[j].Where(w => w.Value == onoffData.OffValue.Value).Count();
                        }
                        else
                        {

                            zeroes = _slist[j].Where(w => w.Value < onoffData.Thresold.Value).Count();
                            nonZeroes = _slist[j].Where(w => w.Value > onoffData.Thresold.Value).Count();

                        }
                        if (zeroes > nonZeroes)
                        {
                            plist.Add(new
                            {
                                x = i,
                                y = j,
                                yc = _slist[j].Key.ToString("dd-MM-yyyy"),
                                p = lowestPoint
                            });
                        }
                        else
                        {
                            plist.Add(new
                            {
                                x = i,
                                y = j,
                                yc = _slist[j].Key.ToString("dd-MM-yyyy"),
                                p = highestPoint
                            });
                        }
                    }
                }
                return plist;
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet, Route("service/widgetdata/temperatureprofile")]
        public object TemperatureProfile(string blockId, string objectId1, string objectId2, string dataFieldId1, string dataFieldId2, string dateFlag)
        {
            DateRange dateRange = new DateRange();
            Range range = new Range();


            try
            {
                switch (dateFlag)
                {
                    case "today":
                        range = dateRange.Today;
                        break;
                    case "yesterday":
                        range = dateRange.Yesterday;
                        break;
                    case "thisweek":
                        range = dateRange.ThisWeek;
                        break;
                    case "lastweek":
                        range = dateRange.LastWeek;
                        break;
                    case "thismonth":
                        range = dateRange.ThisMonth;
                        break;
                    case "lastmonth":
                        range = dateRange.LastMonth;
                        break;
                    case "thisyear":
                        range = dateRange.ThisYear;
                        break;
                    case "lastyear":
                        range = dateRange.LastYear;
                        break;
                    default:
                        dateFlag = dateFlag.Trim();
                        var dates = dateFlag.Split('-');
                        range.From = new DateTime(int.Parse(dates[0]), int.Parse(dates[1]), int.Parse(dates[2]), 0, 0, 0);
                        range.To = new DateTime(int.Parse(dates[3]), int.Parse(dates[4]), int.Parse(dates[5]), 23, 59, 59);
                        break;
                }
                var s1 = (from m in context.TempReadings
                          where m.BuildingId.Equals(blockId) && m.ObjectId.Equals(objectId1) && m.DataFieldId.Equals(dataFieldId1) && m.Timestamp >= range.From && m.Timestamp <= range.To
                          orderby m.Timestamp
                          select new { time = m.Timestamp, YY = m.Timestamp.Year, MM = m.Timestamp.Month - 1, DD = m.Timestamp.Day, hh = m.Timestamp.Hour, mm = m.Timestamp.Minute, ss = m.Timestamp.Second, value = m.Value }).ToList();
                var s2 = (from m in context.TempReadings
                          where m.BuildingId.Equals(blockId) && m.ObjectId.Equals(objectId2) && m.DataFieldId.Equals(dataFieldId2) && m.Timestamp >= range.From && m.Timestamp <= range.To
                          orderby m.Timestamp
                          select new { time = m.Timestamp, YY = m.Timestamp.Year, MM = m.Timestamp.Month - 1, DD = m.Timestamp.Day, hh = m.Timestamp.Hour, mm = m.Timestamp.Minute, ss = m.Timestamp.Second, value = m.Value }).ToList();

                var s1Avg = s1.Select(e => e.value).DefaultIfEmpty(0).Average();
                var s2Avg = s2.Select(e => e.value).DefaultIfEmpty(0).Average();
                if (s1Avg > s2Avg)
                {
                    var s3 = (from m in s1
                              join n in s2
                              on m.time equals n.time
                              orderby m.time
                              select new { YY = m.time.Year, MM = m.time.Month - 1, DD = m.time.Day, hh = m.time.Hour, mm = m.time.Minute, ss = m.time.Second, value = m.value - n.value }).ToList();

                    return new { s1 = s1, s2 = s2, s3 = s3 };
                }
                else
                {
                    var s3 = (from m in s2
                              join n in s1
                              on m.time equals n.time
                              orderby m.time
                              select new { YY = m.time.Year, MM = m.time.Month - 1, DD = m.time.Day, hh = m.time.Hour, mm = m.time.Minute, ss = m.time.Second, value = m.value - n.value }).ToList();

                    return new { s1 = s1, s2 = s2, s3 = s3 };
                }
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }
        [HttpGet, Route("service/widgetdata/ahuprofile")]

        public object ahuprofile(string blockId, string objectId, string dataFieldId1, string dataFieldId2, string dateFlag)
        {
            DateRange dateRange = new DateRange();
            Range range = new Range();


            try
            {
                switch (dateFlag)
                {
                    case "today":
                        range = dateRange.Today;
                        break;
                    case "yesterday":
                        range = dateRange.Yesterday;
                        break;
                    case "thisweek":
                        range = dateRange.ThisWeek;
                        break;
                    case "lastweek":
                        range = dateRange.LastWeek;
                        break;
                    case "thismonth":
                        range = dateRange.ThisMonth;
                        break;
                    case "lastmonth":
                        range = dateRange.LastMonth;
                        break;
                    case "thisyear":
                        range = dateRange.ThisYear;
                        break;
                    case "lastyear":
                        range = dateRange.LastYear;
                        break;
                    default:
                        dateFlag = dateFlag.Trim();
                        var dates = dateFlag.Split('-');
                        range.From = new DateTime(int.Parse(dates[0]), int.Parse(dates[1]), int.Parse(dates[2]), 0, 0, 0);
                        range.To = new DateTime(int.Parse(dates[3]), int.Parse(dates[4]), int.Parse(dates[5]), 23, 59, 59);
                        break;
                }
                var s1 = (from m in context.TempReadings
                          where m.BuildingId.Equals(blockId) && m.ObjectId.Equals(objectId) && m.DataFieldId.Equals(dataFieldId1) && m.Timestamp >= range.From && m.Timestamp <= range.To
                          orderby m.Timestamp
                          select new { time = m.Timestamp, YY = m.Timestamp.Year, MM = m.Timestamp.Month - 1, DD = m.Timestamp.Day, hh = m.Timestamp.Hour, mm = m.Timestamp.Minute, ss = m.Timestamp.Second, value = m.Value }).ToList();
                var s2 = (from m in context.TempReadings
                          where m.BuildingId.Equals(blockId) && m.ObjectId.Equals(objectId) && m.DataFieldId.Equals(dataFieldId2) && m.Timestamp >= range.From && m.Timestamp <= range.To
                          orderby m.Timestamp
                          select new { time = m.Timestamp, YY = m.Timestamp.Year, MM = m.Timestamp.Month - 1, DD = m.Timestamp.Day, hh = m.Timestamp.Hour, mm = m.Timestamp.Minute, ss = m.Timestamp.Second, value = m.Value }).ToList();

                return new { s1 = s1, s2 = s2 };
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (context != null)
                {
                    context.Dispose();
                }
            }
            base.Dispose(disposing);
        }
    }
    public class widgetParamModel
    {
        public string blockId { get; set; }
        public string objectId { get; set; }
        public string dataFieldId { get; set; }
        public string dateFlag { get; set; }
    }
}
