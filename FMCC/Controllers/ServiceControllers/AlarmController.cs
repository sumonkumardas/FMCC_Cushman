using System;
using System.Linq;
using Fmcc.Models;
using System.Net.Http;
using System.Web.Http;
using EntityFramework.Utilities;
using System.Collections.Generic;
using Fmcc.Models.EntityDataModel;
using Fmcc.Extension;
using System.Globalization;
using System.Configuration;
using System.IO;
using System.Xml.Serialization;
using System.Xml;

namespace Fmcc.Controllers.ServiceControllers
{
    [RoutePrefix("api/alarm")]
    public class AlarmController : ApiController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private FMCCDataContext context;
        public AlarmController()
        {
            context = new FMCCDataContext();
        }

        [HttpPost]
        [Route("alarmclientservice")]
        public void Post(List<Alarm> alarmList)
        {
            try
            {
                var alarmFinalList = new List<Alarm>();

                using (var db = new FMCCDataContext())
                {
                    var alarmSupressList = db.AlarmSupresses.ToList();

                    foreach (var alarm in alarmList)
                    {
                        var alarmSupress = alarmSupressList.Where(r => r.Itqf == alarm.Itqf).FirstOrDefault();

                        if (alarmSupress != null && alarmSupress.StartDateTime <= alarm.TimeStamp && alarmSupress.EndDateTime >= alarm.TimeStamp)
                        {
                            alarm.FMCCStatus = 3;
                        }
                        else
                        {
                            alarm.FMCCStatus = 1;
                        }
                        alarmFinalList.Add(alarm);
                    }
                    var replacementList = context.ItqfReplacements.ToList();

                    //EFBatchOperation.For(db, db.Alarms).InsertAll(alarmFinalList);
                    foreach (var alarm in alarmFinalList)
                    {
                        var entity = db.Alarms.Add(alarm);
                        db.SaveChanges();
                        alarm.Id = entity.Id;
                        var newItqfName = replacementList.Where(x => x.Itqf == alarm.Itqf).SingleOrDefault();
                        if (newItqfName != null)
                            alarm.Itqf = newItqfName.ReplacementName;
                    }

                    if (SetUpAlarmDiectory())
                        WriteAlarms(alarmFinalList);
                }
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
            }
        }

        public static string GetXMLFromObject(object o)
        {
            StringWriter sw = new StringWriter();
            XmlTextWriter tw = null;
            try
            {
                XmlSerializer serializer = new XmlSerializer(o.GetType());
                tw = new XmlTextWriter(sw);
                serializer.Serialize(tw, o);
            }
            catch (Exception ex)
            {
                //Handle Exception Code
            }
            finally
            {
                sw.Close();
                if (tw != null)
                {
                    tw.Close();
                }
            }
            return sw.ToString();
        }

        private void WriteAlarms(List<Alarm> alarmFinalList)
        {
            string alarmDirectory = ConfigurationManager.AppSettings["AlarmFolder"];
            foreach (var alarmModel in alarmFinalList)
            {
               if (alarmModel.Id!=0)
                {
                    string xmlData = GetXMLFromObject(alarmModel);
                    string fileName =
                        string.Concat("Alarm-" + alarmModel.Id.ToString() + ".xml");
                    string filePath = alarmDirectory + Path.DirectorySeparatorChar + fileName;

                    File.WriteAllText(filePath, xmlData);
                }
            }
        }

        private bool SetUpAlarmDiectory()
        {
            string alarmDirectory = ConfigurationManager.AppSettings["AlarmFolder"];
            if (
                !Directory.Exists(alarmDirectory))
            {
                try
                {
                    Directory.CreateDirectory(alarmDirectory);
                }
                catch (Exception exception)
                {
                    logger.Info("Unable to create diectory");
                    return false;
                }
            }

            return true;
        }

        [HttpGet]
        [Route("loadbuildinglist")]
        public object LoadBuildingList()
        {
            try
            {
                return context.Buildings.Select(e => new
                {
                    id = e.Id,
                    text = e.Name
                }).ToList();
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }

        }

        [HttpGet]
        [Route("getblocks")]
        public Output GetBlocks()
        {
            Output output = new Output();
            try
            {
                var buildingList = from b in context.Buildings
                                              join s in context.Sites on b.SiteId equals s.Id
                                              select( new { Id = b.Id, BuildingId = b.BuildingId,Site=s.Name });
                output.okay = true;
                output.message = string.Empty;
                output.model = buildingList;

            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;
        }
        [HttpPost]
        [Route("saveblocks")]
        public Output saveBlocks(Building model)
        {
            Output output = new Output();
            try
            {
                var building = context.Buildings.OrderByDescending(u => u.Id).FirstOrDefault();
                model.Id = building.Id + 1;
                context.Buildings.Add(model);
                context.SaveChanges();
                output.okay = true;
                output.message = string.Empty;

            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;
        }

        [HttpGet]
        [Route("loadalarmstatuslist")]
        public object LoadAlarmStatusList()
        {
            try
            {
                return context.AlarmStatus.Select(e => new { id = e.Id, text = e.Name }).ToList();
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet]
        [Route("loadalarmitqflist")]
        public object LoadAlarmItqfList()
        {
            Output result = new Output();
            try
            {
                var list = context.Alarms.Select(e => e.Itqf).OrderBy(e => e).Distinct().ToList();
                result.okay = true;
                result.model = list;
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.model = null;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpGet]
        [Route("loadbuildingforwardalarmlist")]
        public object LoadBuildingForwardAlarmList()
        {
            try
            {

                var queryString = Request.GetQueryNameValuePairs().ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
                int draw = int.Parse(queryString["draw"]);
                int start = int.Parse(queryString["start"]);
                int length = int.Parse(queryString["length"]);
                string search = queryString["search.value"];


                var query = context.BuildingAlarmForwards;
                var filteredData = query.Where(e => e.BuildingName.Contains(search) || e.StatusName.Contains(search)).ToList();
                var data = filteredData.Select(e => new
                {
                    StatusName = e.StatusName,
                    StartDateTime = e.StartDateTime.GetValueOrDefault().ToString("dd/MM/yyyy hh:mm:ss"),
                    EndDateTime = e.EndDateTime.GetValueOrDefault().ToString("dd/MM/yyyy hh:mm:ss")
                }).OrderBy(o => o.StatusName).Skip(start).Take(length).ToList();
                return new
                {
                    draw = draw,
                    data = data,
                    recordsFiltered = filteredData.Count,
                    recordsTotal = query.Count()
                };
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return null;
            }
        }

        [HttpGet]
        [Route("loadbuildingforwardalarmsuppresslist")]
        public object LoadBuildingForwardAlarmSuppressList()
        {
            Output output = new Output();
            try
            {
                var alaemBuildingForwardList = context.AlarmSupresses.ToList();

                output.okay = true;
                output.message = "Data Saved Successfully.";
                output.model = (alaemBuildingForwardList == null && alaemBuildingForwardList.Count == 0) ? new List<AlarmSupress>() : alaemBuildingForwardList;

            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;

        }

        [HttpGet]
        [Route("loadalarmforwardlist")]
        public Output LoadAlarmForwardList()
        {
            Output output = new Output();
            try
            {
                var alaemBuildingForwardList = context.BuildingAlarmForwards.ToList();

                output.okay = true;
                output.message = "Data Saved Successfully.";
                output.model = (alaemBuildingForwardList == null && alaemBuildingForwardList.Count == 0) ? new List<BuildingAlarmForward>() : alaemBuildingForwardList;

            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;

        }

        [HttpGet]
        [Route("loadalarmlist")]
        public object LoadAlarmList()
        {

            DateTime? endDate = null;
            DateTime? startDate = null;
            int start = 0;
            int length = 10;
            var queryString = Request.GetQueryNameValuePairs()
                .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);

            if (queryString.ContainsKey("start"))
            {
                if (!string.IsNullOrEmpty(queryString["start"]))
                {
                    start = Convert.ToInt32(queryString["start"]);
                }
            }
            

            if (queryString.ContainsKey("length"))
            {
                if (!string.IsNullOrEmpty(queryString["length"]))
                {
                    length = Convert.ToInt32(queryString["length"]);
                }
            }
            
            if (queryString.ContainsKey("startDate"))
            {
                if (!string.IsNullOrEmpty(queryString["startDate"]))
                {
                    startDate = StringToDate(queryString["startDate"], "YYYY-MM-DD hh:mm A");
                }
            }
            if (queryString.ContainsKey("endDate"))
            {
                if (!string.IsNullOrEmpty(queryString["endDate"]))
                {
                    endDate = StringToDate(queryString["endDate"], "YYYY-MM-DD hh:mm A");
                }
            }

            int blockId = 0;
            int siteId = 1;
            if (queryString.ContainsKey("blockId"))
            {
                if (!string.IsNullOrEmpty(queryString["blockId"]))
                {
                    blockId = Convert.ToInt32(queryString["blockId"]);
                }
            }

            if (queryString.ContainsKey("siteId"))
            {
                if (!string.IsNullOrEmpty(queryString["siteId"]))
                {
                    siteId = Convert.ToInt32(queryString["siteId"]);
                }
            }

            try
            {
                var query = context.Alarms.Where(e => e.Id != 0);

                if (startDate != null && endDate != null)
                {
                    query = query.Where(e => e.TimeStamp >= startDate && e.TimeStamp <= endDate);

                }

                if (queryString.ContainsKey("FMCCStatus"))
                {
                    if (!string.IsNullOrEmpty(queryString["FMCCStatus"]))
                    {
                        int status = int.Parse(queryString["FMCCStatus"]);
                        query = query.Where(e => e.FMCCStatus == status);
                    }
                }

                int[] buildingList = context.Buildings.Where(x => x.SiteId == siteId)
                                          .Select(e => e.Id)
                                          .Distinct()
                                          .ToArray();

                string[] itqfList = context.BuildingAlarmForwards.Where(x => x.BuildingFkId == blockId)
                          .Select(e => e.StatusName)
                          .Distinct()
                          .ToArray();

                if (blockId != 0)
                {
                    itqfList = context.BuildingAlarmForwards.Where(x => x.BuildingFkId == blockId)
                          .Select(e => e.StatusName)
                          .Distinct()
                          .ToArray();
                    query = query.Where(e => itqfList.Contains(e.Itqf));
                }
                else
                {
                    itqfList = context.BuildingAlarmForwards.Where(x => buildingList.Contains(x.BuildingFkId.Value)).Select(x => x.StatusName).Distinct().ToArray();

                    query = query.Where(e => itqfList.Contains(e.Itqf));
                }
                
                

                
                var queryLoad = query.Select(e => new
                {
                    Id = e.Id,
                    ITQF = e.Itqf,
                    Status = e.Status,
                    SiteName = e.SiteName,
                    ItemCategory = e.ItemCategory,
                    TimeStamp = e.TimeStamp.Value,
                    PreviousStatus = e.PreviousStatus,
                    AcknowledgeRequired = e.AcknowledgeRequired,
                    FMCCStatus = e.FMCCStatus
                }).OrderByDescending(x=>x.TimeStamp).Skip(start).Take(length).ToList();

                var recordsTotal = query.Count();
                var recordsFiltered = query.Count();

                var filteredData = queryLoad.Select(e => new
                {
                    Id = e.Id,
                    SiteName = e.SiteName,
                    Status = e.Status,
                    PreviousStatus = e.PreviousStatus,
                    ITQF = e.ITQF,
                    ItemCategory = e.ItemCategory,
                    AcknowledgeRequired = e.AcknowledgeRequired,
                    TimeStamp = e.TimeStamp,
                    FMCCStatus = e.FMCCStatus
                }).ToList();
                return new
                {
                    draw = Convert.ToInt32(queryString["draw"]),
                    recordsFiltered = recordsFiltered,
                    data = filteredData,
                    recordsTotal = recordsTotal
                };
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return new List<int>();
            }

        }

        [HttpGet]
        [Route("loaddateformat")]
        public string LoadDateFormat()
        {
            string dateFormat = "YYYY-MM-DD hh:mm A";

            try
            {
                if (ConfigurationManager.AppSettings["dateformat"] != null)
                    dateFormat = ConfigurationManager.AppSettings["dateformat"];
            }
            catch (Exception ex)
            {
                // ignored
            }


            return dateFormat;
        }

        [HttpPost]
        [Route("setbuildingforwardalarms")]
        public object SetBuildingForwardAlarms(BuildingAlarmForward model)
        {
            Output result = new Output();
            try
            {
                var alarmForward = context.BuildingAlarmForwards.Where(w => w.Id == model.Id).FirstOrDefault();
                if (alarmForward == null)
                {
                    context.BuildingAlarmForwards.Add(model);
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    alarmForward.StatusName = model.StatusName;
                    alarmForward.BuildingFkId = model.BuildingFkId;
                    alarmForward.BuildingName = model.BuildingName;
                    context.SaveChanges();
                    result.okay = true;
                }
            }
            catch (Exception exeption)
            {
                result.okay = true;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }

            return result;
        }

        [HttpPost]
        [Route("deletebuildingforwardalarms")]
        public object DeleteBuildingForwardAlarms(BuildingAlarmForward model)
        {
            Output result = new Output();
            try
            {
                var alarmForward = context.BuildingAlarmForwards.Where(w => w.Id == model.Id).FirstOrDefault();
                if (alarmForward != null)
                {
                    context.BuildingAlarmForwards.RemoveRange(context.BuildingAlarmForwards.Where(x => x.StatusName == model.StatusName));
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exeption)
            {
                result.okay = true;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }

            return result;
        }

        [HttpPost]
        [Route("setitqfreplacement")]
        public object SetItqfReplacement(ItqfReplacement model)
        {
            Output result = new Output();
            try
            {
                var itqfReplacement = context.ItqfReplacements.Where(w => w.Itqf == model.Itqf).FirstOrDefault();
                if (itqfReplacement == null)
                {
                    context.ItqfReplacements.Add(model);
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    itqfReplacement.ReplacementName = model.ReplacementName;
                    context.SaveChanges();
                    result.okay = true;
                }
            }
            catch (Exception exeption)
            {
                result.okay = true;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }

            return result;
        }

        [HttpPost]
        [Route("deleteitqfreplacement")]
        public object DeleteItqfReplacement(ItqfReplacement model)
        {
            Output result = new Output();
            try
            {
                var itqfReplacement = context.ItqfReplacements.Where(w => w.Itqf == model.Itqf).FirstOrDefault();
                if (itqfReplacement != null)
                {
                    context.ItqfReplacements.RemoveRange(context.ItqfReplacements.Where(x => x.Itqf == model.Itqf && x.ReplacementName==model.ReplacementName));
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exeption)
            {
                result.okay = true;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }

            return result;
        }

        [HttpGet]
        [Route("loaditqfreplacementlist")]
        public Output LoadItqfReplacementList()
        {
            Output output = new Output();
            try
            {
                var itqfReplacementList = context.ItqfReplacements.ToList();

                output.okay = true;
                output.message = "";
                output.model = (itqfReplacementList == null && itqfReplacementList.Count == 0) ? new List<ItqfReplacement>() : itqfReplacementList;

            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;

        }

        [HttpPost]
        [Route("checkitqfexists")]
        public Output CheckItqfExists(ItqfReplacement model)
        {
            Output output = new Output();
            try
            {
                var itqfR = context.Alarms.Where(x => x.Itqf == model.Itqf).FirstOrDefault();

                output.okay = itqfR != null;
                output.message = "";
                output.model = null;

            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;

        }


        [HttpPost]
        [Route("setbuildingforwardalarmsuppress")]
        public object SetBuildingForwardAlarmSuppress(AlarmSupress model)
        {
            var result = new Output();
            try
            {
                if (model != null)
                {
                    var alarmForward = context.AlarmSupresses.Where(w => w.Itqf == model.Itqf).FirstOrDefault();
                    if (alarmForward == null)
                    {
                        context.AlarmSupresses.Add(model);
                        context.SaveChanges();
                    }
                    else
                    {
                        alarmForward.EndDateTime = model.EndDateTime;
                        alarmForward.StartDateTime = model.StartDateTime;
                        context.SaveChanges();
                    }
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exeption)
            {
                result.okay = false;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }

            return result;
        }

        [HttpPost]
        [Route("deletebuildingforwardalarmsuppress")]
        public object DeleteBuildingForwardAlarmSuppress(AlarmSupress model)
        {
            var result = new Output();
            try
            {
                if (model != null)
                {
                    context.Alarms.RemoveRange(context.Alarms.Where(x => x.Itqf == model.Itqf && x.FMCCStatus == 3 && x.TimeStamp >= model.StartDateTime && x.TimeStamp<=model.EndDateTime));
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exeption)
            {
                result.okay = false;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }

            return result;
        }

        [HttpPost]
        [Route("setundefined")]
        public object SetUndefined(Alarm model)
        {
            Output result = new Output();
            try
            {
                if (model != null)
                {
                    if (model.Id > 0)
                    {
                        var alarm = context.Alarms.Find(model.Id);
                        if (alarm != null)
                        {
                            alarm.FMCCStatus = 1;
                            context.SaveChanges();
                            result.okay = true;
                        }
                        else
                        {
                            result.okay = false;
                        }
                    }
                    else
                    {
                        result.okay = false;
                    }
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exeption)
            {
                result.okay = false;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }
            return result;
        }

        [HttpPost]
        [Route("setacknowledged")]
        public object SetAcknowledged(Alarm model)
        {
            Output result = new Output();
            try
            {
                if (model != null)
                {
                    if (model.Id > 0)
                    {
                        var alarm = context.Alarms.Find(model.Id);
                        if (alarm != null)
                        {
                            alarm.FMCCStatus = 2;
                            context.SaveChanges();
                            result.okay = true;
                        }
                        else
                        {
                            result.okay = false;
                        }
                    }
                    else
                    {
                        result.okay = false;
                    }
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exeption)
            {
                result.okay = false;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }
            return result;
        }

        [HttpPost]
        [Route("setsupressed")]
        public object SetSupressed(Range range)
        {
            Output result = new Output();
            try
            {
                if (range != null)
                {
                    if (range.From != null && range.To != null && range.From < range.To)
                    {
                        var alarms = context.Alarms.Where(e => e.TimeStamp >= range.From && e.TimeStamp <= range.To).ToList();
                        if (alarms.Count > 0)
                        {
                            foreach (Alarm alarm in alarms)
                            {
                                alarm.FMCCStatus = 3;
                            }
                            context.SaveChanges();
                            result.okay = true;
                        }
                        else
                        {
                            result.okay = false;
                        }
                    }
                    else
                    {
                        result.okay = false;
                    }
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exeption)
            {
                result.okay = false;
                result.message = exeption.Message;
                logger.Error(exeption.Message);
            }
            return result;
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


        private DateTime? StringToDate(string value, string format)
        {
            DateTime? datetime = null;
            if (!string.IsNullOrEmpty(value) && !string.IsNullOrEmpty(format))
            {
                switch (format)
                {
                    case "YYYY-MM-DD hh:mm A":

                        value = value.Trim();
                        var values = value.Split(new[] { ' ' });
                        if (values.Length == 3)
                        {
                            var date = DateTime.Now;
                            var dateString = values[0].Trim();
                            var datePart = dateString.Split(new[] { '-' });
                            if (datePart.Length == 3)
                            {
                                var year = int.Parse(datePart[0].Trim());
                                var month = int.Parse(datePart[1].Trim());
                                var day = int.Parse(datePart[2].Trim());
                                date = new DateTime(year, month, day).Date;
                            }

                            var timeString = values[1].Trim();
                            var timepart = timeString.Split(new[] { ':' });
                            if (timepart.Length == 2)
                            {
                                var hour = int.Parse(timepart[0].Trim());
                                var minute = int.Parse(timepart[1].Trim());
                                datetime = date.AddHours(hour).AddMinutes(minute);
                            }

                            var amPm = values[2].Trim().ToLower();
                            if (amPm != "am")
                            {
                                datetime.Value.AddHours(12);
                            }
                        }
                        else
                        {
                            return null;
                        }
                        break;
                    default:
                        break;
                }
            }

            return datetime;
        }
    }
}
