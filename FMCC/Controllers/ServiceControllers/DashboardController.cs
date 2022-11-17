using System;
using System.Linq;
using Fmcc.Extension;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using System.Collections.Generic;
using Fmcc.Models;
using log4net;

namespace Fmcc.Controllers.ServiceControllers
{
    public class DashboardController : ApiController
    {
        readonly ILog logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private FMCCDataContext context;

        public DashboardController()
        {
            context = new FMCCDataContext();
        }

        [HttpGet]
        [Route("api/dashboard")]
        public Output GetDashboard(int siteId)
        {
            Output output = new Output();
            Dashboard dashboard = new Dashboard();
            PeriodRange dateTimePeriod = new PeriodRange();

            try
            {
                int[] buildingIdList = context.Buildings.Where(x => x.SiteId == siteId)
                            .Select(e => e.Id)
                            .Distinct()
                            .ToArray();
                string[] pUnitList = context.ObjectUnitMappings
                    .Where(o => o.ObjectDataField == "OverallPowerConsumption")
                    .Select(e => e.UnitName)
                    .ToArray();

                string[] wUnitList = context.ObjectUnitMappings
                    .Where(o => o.ObjectDataField == "OverallWaterConsumption")
                    .Select(e => e.UnitName)
                    .ToArray();

                var pObjectDataFieldlist = context.BuildingObjectDatas
                    .Where(e => pUnitList.Contains(e.DataFieldUnit) && buildingIdList.Contains(e.BuildingFkId))
                    
                    .Select(e => new
                    {
                        ObjectId = e.ObjectId,
                        DataFieldId = e.DataFieldId
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

                var wObjectDataFieldlist = context.BuildingObjectDatas
                    .Where(e => wUnitList.Contains(e.DataFieldUnit) && buildingIdList.Contains(e.BuildingFkId))
                    .Select(e => new
                    {
                        ObjectId = e.ObjectId,
                        DataFieldId = e.DataFieldId
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

                string[] oObjectList = pObjectList
                    .Concat(wObjectList)
                    .Distinct()
                    .ToArray();

                var buildingList = (from building in context.Buildings
                                    join tempreading in context.TempReadings
                                    .Where(w =>
                                      oObjectList.Contains(w.ObjectId) &&
                                      w.Timestamp >= dateTimePeriod.Yesterday.LowerBound &&
                                      w.Timestamp <= dateTimePeriod.Yesterday.UpperBound
                                      )
                                      
                                    .GroupBy(g => g.BuildingId)
                                    .Select(s => new
                                    {
                                        BuildingId = s.Key,
                                        Power = s.Where(ww => pDataFieldList.Contains(ww.DataFieldId)).Select(ss => ss.Value).DefaultIfEmpty(0).Average(),
                                        Water = s.Where(ww => wDataFieldList.Contains(ww.DataFieldId)).Select(ss => ss.Value).DefaultIfEmpty(0).Average()
                                    }) on building.BuildingId equals tempreading.BuildingId into buildingReading
                                    from matchedReading in buildingReading.DefaultIfEmpty()
                                    select new
                                    {
                                        Name = building.Name,
                                        Power = (matchedReading == null) ? 0 : matchedReading.Power,
                                        Water = (matchedReading == null) ? 0 : matchedReading.Water,
                                        BuildingId = building.BuildingId,
                                        ImageSource = building.ImageLocation
                                    })
                                .OrderBy(o => o.BuildingId)
                                .ToList();

                dashboard.WaterAvg = Math.Round(buildingList.Where(w => w.Water != 0).Select(e => e.Water).DefaultIfEmpty(0).Average(), 5);
                dashboard.PowerAvg = Math.Round(buildingList.Where(w => w.Power != 0).Select(e => e.Power).DefaultIfEmpty(0).Average(), 5);
                
                ;
                dashboard.AlarmCount = context.Alarms.Where(e => e.FMCCStatus == 1).Count();
                var alartList = from alert in context.Alerts
                    
                    where buildingIdList.Contains(alert.BuildingFkId) && alert.FMCCStatus == 1 
                
                    select alert;
                dashboard.AlertCount = alartList.Count();

                dashboard.Blocks = new List<Block>();
                foreach (var building in buildingList)
                {
                    Block block = new Block();
                    block.Name = building.Name;
                    block.Water = Math.Round(building.Water, 0);
                    block.Power = Math.Round(building.Power, 0);
                    block.Image = string.IsNullOrEmpty(building.ImageSource) ? "../images/buildings/default.jpg" : building.ImageSource;
                    dashboard.Blocks.Add(block);
                }
                output.okay = true;
                output.model = dashboard;
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
}
