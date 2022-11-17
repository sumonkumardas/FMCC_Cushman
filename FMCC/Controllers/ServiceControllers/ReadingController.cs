using System;
using System.Linq;
using Fmcc.Models;
using Fmcc.Extension;
using System.Web.Http;
using System.Collections.Generic;
using Fmcc.Models.EntityDataModel;
using System.Data.Entity.SqlServer;
using System.Web.Mvc.Html;

namespace Fmcc.Controllers.ServiceControllers
{
    public class ReadingController : ApiController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        #region Reading Context
        private readonly FMCCDataContext context;
        #endregion

        #region Reading Constructor
        public ReadingController()
        {
            context = new FMCCDataContext();
        }
        #endregion

        #region Reading Http Methods

        [HttpGet]
        [Route("api/reading")]
        public Output Get(string type, string field, string period, int offset,int siteId)
        {
            Output output = new Output();

            type = string.IsNullOrEmpty(type) ? "" : type.ToLower();
            field = string.IsNullOrEmpty(type) ? "" : field.ToLower();
            period = string.IsNullOrEmpty(type) ? "" : period.ToLower();

            int[] buildingList = context.Buildings.Where(x => x.SiteId == siteId)
                            .Select(e => e.Id)
                            .Distinct()
                            .ToArray();
            try
            {
                if (type.Equals("overall"))
                {
                    if (field == "powerconsumption")
                    {
                        string[] pUnitList = context.ObjectUnitMappings
                            .Where(o => o.ObjectDataField == "OverallPowerConsumption")
                            .Select(e => e.UnitName)
                            .ToArray();

                        var pObjectDataFieldlist = context.BuildingObjectDatas
                            .Where(e => pUnitList.Contains(e.DataFieldUnit) && buildingList.Contains(e.BuildingFkId))
                            .Select(e => new
                            {
                                ObjectId = e.ObjectId,
                                DataFieldId = e.DataFieldId,
                                ObjectFkId=e.ObjectFkId,
                                DataFieldFkId=e.DataFieldFkId
                            })
                            .ToList();

                        string[] pObjectList = pObjectDataFieldlist
                            .Select(e => e.ObjectId)
                            .Distinct()
                            .ToArray();

                        string[] pDataFieldList = pObjectDataFieldlist
                            .Select(e => e.DataFieldId)
                            .Distinct()
                            .ToArray();

                        int[] objectIdList = pObjectDataFieldlist
                            .Select(e => e.ObjectFkId)
                            .Distinct()
                            .ToArray();

                        int[] dataFieldIdList = pObjectDataFieldlist
                            .Select(e => e.DataFieldFkId)
                            .Distinct()
                            .ToArray();

                        output = GetReadingByPeriod(period, offset, pObjectList, pDataFieldList,siteId, objectIdList,dataFieldIdList, pUnitList[0]);

                    }
                    else if (field == "waterconsumption")
                    {
                        string[] wUnitList = context.ObjectUnitMappings
                            .Where(o => o.ObjectDataField == "OverallWaterConsumption")
                            .Select(e => e.UnitName)
                            .ToArray();

                        var wObjectDataFieldlist = context.BuildingObjectDatas
                            .Where(e => wUnitList.Contains(e.DataFieldUnit) && buildingList.Contains(e.BuildingFkId))
                            .Select(e => new
                            {
                                ObjectId = e.ObjectId,
                                DataFieldId = e.DataFieldId,
                                ObjectFkId = e.ObjectFkId,
                                DataFieldFkId = e.DataFieldFkId
                            })
                            .ToList();

                        string[] wObjectList = wObjectDataFieldlist
                            .Select(e => e.ObjectId)
                            .Distinct()
                            .ToArray();

                        string[] wDataFieldList = wObjectDataFieldlist
                            .Select(e => e.DataFieldId)
                            .Distinct()
                            .ToArray();

                        int[] objectIdList = wObjectDataFieldlist
                            .Select(e => e.ObjectFkId)
                            .Distinct()
                            .ToArray();

                        int[] dataFieldIdList = wObjectDataFieldlist
                            .Select(e => e.DataFieldFkId)
                            .Distinct()
                            .ToArray();
                        output = GetReadingByPeriod(period, offset, wObjectList, wDataFieldList,siteId,objectIdList,dataFieldIdList,wUnitList[0]);
                    }
                    else
                    {
                        output.okay = false;
                        output.model = new TempReading();
                        output.message = string.Empty;
                    }
                }
                else
                {
                    output.okay = false;
                    output.model = new TempReading();
                    output.message = string.Empty;
                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.model = new TempReading();
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
        }

        [HttpGet]
        [Route("api/reading/{name}")]
        public string GetUnit(string name)
        {
            try
            {
                if (name == "OverallPowerConsumption")
                {
                    return context.ObjectUnitMappings
                        .FirstOrDefault(o => o.ObjectDataField == name)
                        .UnitName;

                }
                else if (name == "OverallWaterConsumption")
                {
                    return context.ObjectUnitMappings
                        .FirstOrDefault(o => o.ObjectDataField == name)
                        .UnitName;

                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return null;
        }

        #endregion

        #region Reading Functions


        private Output GetReadingByPeriod(string period, int offset, string[] objectList, string[] dataFieldList,int siteId,int[]objectIdList,int[]dataFieldIdlist,string unit)
        {
            Output output = new Output();
            Range periodRange = new Range();
            int[] buildingList = context.Buildings.Where(x => x.SiteId == siteId)
                            .Select(e => e.Id)
                            .Distinct()
                            .ToArray();
            switch (period)
            {
                case "sofartoday":
                    periodRange = PeriodRange.GetRange(offset, "dd");
                    try
                    {
                        //List<Building> buildingList = .ToList();
                        
                        List<DatePartBlockValue> hourlyBlockReading = context.TempReadings
                                                                      .Where(w =>
                            buildingList.Contains(w.BuildingFkId)&&
                            //objectIdList.Contains(w.ObjectFkId) &&
                            dataFieldIdlist.Contains(w.DataFieldFkId) &&
                            w.Timestamp >= periodRange.From &&
                            w.Timestamp <= periodRange.To)
                          .GroupBy(g => new
                          {
                              BuildingId = g.BuildingId,
                              DatePart = g.Timestamp.Hour
                          })
                          .Select(e => new DatePartBlockValue
                          {
                              DatePart = e.Key.DatePart,
                              BuildingId = e.Key.BuildingId,
                              Value = e.Select(sm => sm.Value).DefaultIfEmpty(0).Sum()
                          })
                          .OrderBy(o => o.DatePart).ToList();
                        Range dPrevious = PeriodRange.GetRange(offset - 1, "dd");

                        ObjectDataFieldPeriod hourlyObjectDataFieldPeriod = new ObjectDataFieldPeriod()
                        {
                            Object = objectList,
                            DataField = dataFieldList,
                            Period = period,
                            TotalHours = 24,
                            PreviousTotalHours = 24,
                            CurrentPeriod = new DateTimeRange { LowerBound = periodRange.From, UpperBound = periodRange.To },
                            PreviousPeriod = new DateTimeRange { LowerBound = dPrevious.From, UpperBound = dPrevious.To }
                        };
                        Output result = GetTempReading(hourlyBlockReading, hourlyObjectDataFieldPeriod, unit,periodRange.From.ToString(),periodRange.To.ToString());
                        
                        output.okay = result.okay;
                        output.model = result.model;
                        output.message = result.message;
                    }
                    catch (Exception exception)
                    {
                        logger.Error(exception.Message);
                        output.okay = false;
                        output.model = null;
                        output.message = exception.Message;
                    }
                    break;
                case "sofarthisweek":
                    periodRange = PeriodRange.GetRange(offset, "ww");
                    try
                    {
                        List<DatePartBlockValue> weeklyBlockReading = context.TempReadings
                          .Where(w =>
                            buildingList.Contains(w.BuildingFkId) &&
                            //objectIdList.Contains(w.ObjectFkId) &&
                            dataFieldIdlist.Contains(w.DataFieldFkId) &&
                            w.Timestamp >= periodRange.From &&
                            w.Timestamp <= periodRange.To)
                          .GroupBy(g => new
                          {
                              BuildingId = g.BuildingId,
                              DatePart = SqlFunctions.DatePart("weekday", g.Timestamp)
                          })
                          .Select(e => new DatePartBlockValue
                          {
                              DatePart = e.Key.DatePart,
                              BuildingId = e.Key.BuildingId,
                              Value = e.Select(sm => sm.Value).DefaultIfEmpty(0).Sum()
                          })
                          .OrderBy(o => o.DatePart).ToList();

                        Range wPrevious = PeriodRange.GetRange(offset - 1, "ww");

                        ObjectDataFieldPeriod weeklyObjectDataFieldPeriod = new ObjectDataFieldPeriod()
                        {
                            Object = objectList,
                            Period = period,
                            DataField = dataFieldList,
                            TotalHours = 7 * 24,
                            PreviousTotalHours = 7 * 24,
                            CurrentPeriod = new DateTimeRange { LowerBound = periodRange.From, UpperBound = periodRange.To },
                            PreviousPeriod = new DateTimeRange { LowerBound = wPrevious.From, UpperBound = wPrevious.To }
                        };
                        Output result = GetTempReading(weeklyBlockReading, weeklyObjectDataFieldPeriod, unit, periodRange.From.ToString(), periodRange.To.ToString());
                        output.okay = result.okay;
                        output.model = result.model;
                        output.message = result.message;
                    }
                    catch (Exception exception)
                    {
                        output.okay = false;
                        output.model = null;
                        output.message = exception.Message;
                        logger.Error(exception.Message);
                    }
                    break;
                case "sofarthismonth":
                    periodRange = PeriodRange.GetRange(offset, "mm");
                    try
                    {
                        var dailyBlockReading = context.TempReadings
                          .Where(w =>
                            buildingList.Contains(w.BuildingFkId) &&
                            //objectIdList.Contains(w.ObjectFkId) &&
                            dataFieldIdlist.Contains(w.DataFieldFkId) &&
                            w.Timestamp >= periodRange.From &&
                            w.Timestamp <= periodRange.To)
                          .GroupBy(g => new
                          {
                              BuildingId = g.BuildingId,
                              DatePart = g.Timestamp.Day
                          })
                          .Select(e => new DatePartBlockValue
                          {
                              DatePart = e.Key.DatePart,
                              BuildingId = e.Key.BuildingId,
                              Value = e.Select(sm => sm.Value).DefaultIfEmpty(0).Sum()
                          })
                          .OrderBy(o => o.DatePart).ToList();

                        Range mPrevious = PeriodRange.GetRange(offset - 1, "mm");

                        ObjectDataFieldPeriod dailyObjectDataFieldPeriod = new ObjectDataFieldPeriod()
                        {
                            Object = objectList,
                            Period = period,
                            DataField = dataFieldList,
                            CurrentPeriod = new DateTimeRange { LowerBound = periodRange.From, UpperBound = periodRange.To },
                            PreviousPeriod = new DateTimeRange { LowerBound = mPrevious.From, UpperBound = mPrevious.To },
                            TotalHours = DateTime.DaysInMonth(periodRange.From.Year, periodRange.From.Month) * 24,
                            PreviousTotalHours = DateTime.DaysInMonth(mPrevious.From.Year, mPrevious.From.Month) * 24
                        };

                        Output result = GetTempReading(dailyBlockReading, dailyObjectDataFieldPeriod,unit, periodRange.From.ToString(), periodRange.To.ToString());
                        output.okay = result.okay;
                        output.model = result.model;
                        output.message = result.message;
                    }
                    catch (Exception exception)
                    {
                        output.okay = false;
                        output.model = null;
                        output.message = exception.Message;
                        logger.Error(exception.Message);
                    }
                    break;
                case "sofarthisyear":
                    periodRange = PeriodRange.GetRange(offset, "yy");
                    try
                    {
                        //Reading of blocks grouped by month and buildingId
                        var monthlyBlockReading = context.TempReadings
                          .Where(w =>
                            buildingList.Contains(w.BuildingFkId) &&
                            //objectIdList.Contains(w.ObjectFkId) &&
                            dataFieldIdlist.Contains(w.DataFieldFkId) &&
                            w.Timestamp >= periodRange.From &&
                            w.Timestamp <= periodRange.To)
                          .GroupBy(g => new
                          {
                              BuildingId = g.BuildingId,
                              DatePart = g.Timestamp.Month
                          })
                          .Select(e => new DatePartBlockValue
                          {
                              DatePart = e.Key.DatePart,
                              BuildingId = e.Key.BuildingId,
                              Value = e.Select(sm => sm.Value).DefaultIfEmpty(0).Sum()
                          })
                          .OrderBy(o => o.DatePart).ToList();
                        var yPrevious = PeriodRange.GetRange(offset - 1, "yy");
                        ObjectDataFieldPeriod monthlyObjectDataFieldPeriod = new ObjectDataFieldPeriod()
                        {
                            Object = dataFieldList,
                            Period = period,
                            DataField = dataFieldList,
                            CurrentPeriod = new DateTimeRange { LowerBound = periodRange.From, UpperBound = periodRange.To },
                            PreviousPeriod = new DateTimeRange { LowerBound = yPrevious.From, UpperBound = yPrevious.To },
                            TotalHours = GetDaysInYear(periodRange.From.Year) * 24,
                            PreviousTotalHours = GetDaysInYear(yPrevious.From.Year) * 24
                        };

                        Output result = GetTempReading(monthlyBlockReading, monthlyObjectDataFieldPeriod,unit, periodRange.From.ToString(), periodRange.To.ToString());
                        output.okay = result.okay;
                        output.model = result.model;
                        output.message = result.message;
                    }
                    catch (Exception exception)
                    {
                        output.okay = false;
                        output.model = null;
                        output.message = exception.Message;
                        logger.Error(exception.Message);
                    }
                    break;
                default:
                    output.okay = false;
                    output.model = new TempReading();
                    output.message = "No matched case.";
                    break;
            }
            return output;
        }

        private Output GetTempReading(List<DatePartBlockValue> dataList, ObjectDataFieldPeriod options, string unit,string fromDate=null,string toDate = null)
        {
            Output output = new Output();
            try
            {
                // TempReading Response Model Initialization
                MyTempReading tempReading = new MyTempReading()
                {
                    Overall = new OverallReading(),
                    Individual = new List<IndividualReading>(),
                    FromDate = fromDate == null?DateTime.MinValue : Convert.ToDateTime(fromDate),
                    ToDate = toDate==null?DateTime.MinValue : Convert.ToDateTime(toDate),
                    Unit=unit
                };

                // Overall Reading grouped by DatePart
                tempReading.Overall.Reading = dataList
                  .GroupBy(g => g.DatePart)
                  .Select(s => new DbReading
                  {
                      Key = s.Key.Value.ToString("D2"),
                      Sum = s.Select(sm => sm.Value).DefaultIfEmpty(0).Sum(),
                      Avg = s.Select(sm => sm.Value).DefaultIfEmpty(0).Average()
                  })
                  .ToList();

                // Overall Reading average
                tempReading.Overall.Average = tempReading.Overall.Reading.Select(e => e.Sum).DefaultIfEmpty(0).Average();

                // Sum of so far previous values
                var previousDatePartData = context.TempReadings
                  .Where(w =>
                    options.Object.Contains(w.ObjectId) &&
                    options.DataField.Contains(w.DataFieldId) &&
                    w.Timestamp >= options.PreviousPeriod.LowerBound &&
                    w.Timestamp <= options.PreviousPeriod.UpperBound)
                  .Select(s => s.Value)
                  .DefaultIfEmpty(0)
                  .Sum();

                //Current period's total and forecast calculation
                double currentHours = Math.Ceiling((options.CurrentPeriod.UpperBound - options.CurrentPeriod.LowerBound).TotalHours);
                tempReading.Overall.Total = tempReading.Overall.Reading.Select(e => e.Sum).DefaultIfEmpty(0).Sum();
                tempReading.Overall.ForeCast = (tempReading.Overall.Total * (options.TotalHours - currentHours)) / currentHours;
                tempReading.Overall.Total = tempReading.Overall.Total + tempReading.Overall.ForeCast;

                //Previous period's total and forecast calculation      
                double previousHours = Math.Ceiling((options.PreviousPeriod.UpperBound - options.PreviousPeriod.LowerBound).TotalHours);
                tempReading.Overall.PreviousTotal = previousDatePartData;
                tempReading.Overall.PreviousForeCast = (previousDatePartData * (options.TotalHours - currentHours)) / previousHours;
                //tempReading.Overall.PreviousTotal = tempReading.Overall.PreviousTotal + tempReading.Overall.PreviousForeCast;

                //Percent comparison of total with previous total
                if (tempReading.Overall.PreviousTotal > 0 && tempReading.Overall.Total > 0)
                {
                    tempReading.Overall.TotalCompare = ((tempReading.Overall.Total - tempReading.Overall.PreviousTotal) * 100) / tempReading.Overall.PreviousTotal;
                }
                else
                {
                    tempReading.Overall.TotalCompare = 0;
                }

                //Percent comparison of forecast with previous forecast
                if (tempReading.Overall.PreviousForeCast > 0 && tempReading.Overall.ForeCast > 0)
                {
                    tempReading.Overall.ForeCastCompare = ((tempReading.Overall.ForeCast - tempReading.Overall.PreviousForeCast) * 100) / tempReading.Overall.PreviousForeCast;
                }
                else
                {
                    tempReading.Overall.ForeCastCompare = 0;
                }

                //Individual Reading grouped by buildingId and DatePart
                var dataGroupedByBuildingId = dataList
                  .GroupBy(g => g.BuildingId)
                  .Select(sb => new
                  {
                      BuildingId = sb.Key,
                      Readings = sb.GroupBy(g => g.DatePart)
                      .Select(sd => new DbReading
                      {
                          Key = sd.Key.Value.ToString("D2"),
                          Sum = sd.Select(sm => sm.Value).DefaultIfEmpty(0).Sum(),
                          Avg = sd.Select(sm => sm.Value).DefaultIfEmpty(0).Average()
                      }).OrderBy(o => o.Key).ToList()
                  }).OrderBy(o => o.BuildingId).ToList();

                //Container for building that is compared against efficiency 
                List<BuildingValueModel> buildingValueModel = new List<BuildingValueModel>();

                foreach (var building in dataGroupedByBuildingId)
                {
                    //Individual building with their associate reading and average
                    IndividualReading iReading = new IndividualReading(building.BuildingId)
                    {
                        Reading = building.Readings,
                        Average = building.Readings.Select(e => e.Sum).DefaultIfEmpty(0).Average()
                    };

                    if (iReading.Reading.Count > 1 && dataGroupedByBuildingId.Count > 1)
                    {
                        double totalAvg = iReading.Average;
                        double lastAvg = iReading.Reading.LastOrDefault().Avg;
                        double percentComparision = ((lastAvg - totalAvg) * 100) / totalAvg;

                        buildingValueModel.Add(new BuildingValueModel
                        {
                            Value = percentComparision,
                            BuildingId = building.BuildingId
                        });
                    }
                    tempReading.Individual.Add(iReading);
                }

                // check if efficiency calculation is performed
                if (buildingValueModel.Count > 0)
                {
                    //Arrange container in a ordered by value fashion
                    buildingValueModel = buildingValueModel.OrderBy(e => e.Value).ToList();

                    if (dataGroupedByBuildingId.Count > 1)
                    {
                        tempReading.Overall.Maximum = buildingValueModel.FirstOrDefault();
                        tempReading.Overall.Minimum = buildingValueModel.LastOrDefault();
                    }
                    else
                    {
                        tempReading.Overall.Maximum = new BuildingValueModel();
                        tempReading.Overall.Minimum = new BuildingValueModel();
                    }
                }
                else
                {
                    //Return default model for most and least efficient
                    tempReading.Overall.Maximum = new BuildingValueModel();
                    tempReading.Overall.Minimum = new BuildingValueModel();
                }
                output.okay = true;
                output.model = tempReading;
                output.message = string.Empty;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.model = null;
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
        }

        private int GetDaysInYear(int year)
        {
            var thisYear = new DateTime(year, 1, 1);
            var nextYear = new DateTime(year + 1, 1, 1);
            return (nextYear - thisYear).Days;
        }

        
        #endregion

        #region Context Disposer

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

        #endregion
    }
}