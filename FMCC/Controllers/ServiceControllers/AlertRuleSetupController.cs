using System;
using System.Configuration;
using Fmcc.Models;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using Fmcc.Extension;

namespace Fmcc.Controllers
{
    [RoutePrefix("api/alertrule")]
    public class AlertRuleSetupController : ApiController
    {
        private FMCCDataContext dataContext;

        public AlertRuleSetupController()
        {
            dataContext = new FMCCDataContext();
        }

        [HttpGet]
        [Route("readall")]
        public Output GetAlertRuleSetupList()
        {
            Output output = new Output();
            try
            {
                output.model = dataContext.AlertRuleSetups.Select(e => new AlertRuleSetupModel
                {
                    Id = e.Id,
                    AlertText = e.AlertText,
                    Remarks = e.Remarks,
                    AlertNotifyUser = dataContext.AlertNotifyUsers.Where(w => w.AlertRuleSetupId == e.Id).Select(se => se.UserId.Value).ToList(),
                    BuildingFkId = e.BuildingFkId,
                    BuildingId = e.BuildingId,
                    ObjectFkId = e.ObjectFkId,
                    ObjectId = e.ObjectId,
                    DataFieldFkId = e.DataFieldFkId,
                    SelectedDataIds = e.SelectedDataIds,
                    Percentage = e.Percentage,
                    DataFieldId = e.DataFieldId,
                    Condition = e.Condition,
                    ThresholdValue = e.ThresholdValue,
                    Severity = e.Severity,
                    ReferenceValue = e.ReferenceValue,
                    FixedRuleByFMCC = e.FixedRuleByFMCC,
                    IsEmail = e.IsEmail,
                    IsSMS = e.IsEmail,
                    IsActive = e.IsActive,
                    CreatedBy = e.CreatedBy,
                    CreatedDate = e.CreatedDate,
                    UpdatedBy = e.UpdatedBy,
                    UpdatedDate = e.UpdatedDate,
                    IPAddress = e.IPAddress,
                    Type = e.Type,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    WeekDays = e.WeekDays,

                }).ToList();
                output.okay = true;
            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
            }
            return output;
        }



        [HttpGet]
        [Route("readabyid")]
        public Output GetAlertRuleSetupListById(int id)
        {
            Output output = new Output();
            try
            {
                output.model = dataContext.AlertRuleSetups.Select(e => new AlertRuleSetupModel
                {
                    Id = e.Id,
                    AlertText = e.AlertText,
                    Remarks = e.Remarks,
                    AlertNotifyUser = dataContext.AlertNotifyUsers.Where(w => w.AlertRuleSetupId == e.Id).Select(se => se.UserId.Value).ToList(),
                    BuildingFkId = e.BuildingFkId,
                    BuildingId = e.BuildingId,
                    ObjectFkId = e.ObjectFkId,
                    SelectedDataIds = e.SelectedDataIds,
                    Percentage = e.Percentage,
                    ObjectId = e.ObjectId,
                    DataFieldFkId = e.DataFieldFkId,
                    DataFieldId = e.DataFieldId,
                    Condition = e.Condition,
                    ThresholdValue = e.ThresholdValue,
                    Severity = e.Severity,
                    ReferenceValue = e.ReferenceValue,
                    FixedRuleByFMCC = e.FixedRuleByFMCC,
                    IsEmail = e.IsEmail,
                    IsSMS = e.IsEmail,
                    IsActive = e.IsActive,
                    CreatedBy = e.CreatedBy,
                    CreatedDate = e.CreatedDate,
                    UpdatedBy = e.UpdatedBy,
                    UpdatedDate = e.UpdatedDate,
                    IPAddress = e.IPAddress,
                    Type = e.Type,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    WeekDays = e.WeekDays,

                }).Where(x => x.Id == id).FirstOrDefault();
                output.okay = true;
            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
            }
            return output;
        }

        [Route("create")]
        public Output SetAlertRuleSetup(AlertRuleSetupModel model)
        {
            Output output = new Output();
            try
            {
                AlertRuleSetup dbmodel = new AlertRuleSetup();
                dbmodel.Id = model.Id;
                dbmodel.AlertText = model.AlertText;
                dbmodel.Remarks = model.Remarks;
                dbmodel.BuildingFkId = model.BuildingFkId;

                if (model.BuildingFkId > 0)
                {
                    var bod = dataContext.BuildingObjectDatas.Where(e => e.BuildingFkId == model.BuildingFkId).FirstOrDefault();
                    if (bod != null)
                    {
                        dbmodel.BuildingId = bod.BuildingId;
                    }
                }

                dbmodel.ObjectFkId = model.ObjectFkId;
                dbmodel.SelectedDataIds = model.SelectedDataIds;
                dbmodel.Percentage = model.Percentage;
                if (model.ObjectFkId > 0)
                {
                    var bod = dataContext.BuildingObjectDatas.Where(e => e.ObjectFkId == model.ObjectFkId).FirstOrDefault();
                    if (bod != null)
                    {
                        dbmodel.ObjectId = bod.ObjectId;
                    }
                }

                dbmodel.DataFieldFkId = model.DataFieldFkId;

                if (model.DataFieldFkId > 0)
                {
                    var bod = dataContext.BuildingObjectDatas.Where(e => e.DataFieldFkId == model.DataFieldFkId).FirstOrDefault();
                    if (bod != null)
                    {
                        dbmodel.DataFieldId = bod.DataFieldId;
                    }
                }

                dbmodel.Condition = model.Condition;
                dbmodel.ThresholdValue = model.ThresholdValue;
                dbmodel.Severity = model.Severity;
                dbmodel.ReferenceValue = model.ReferenceValue;
                dbmodel.FixedRuleByFMCC = model.FixedRuleByFMCC;
                dbmodel.IsEmail = model.IsEmail.HasValue ? model.IsEmail.Value : true;
                dbmodel.IsSMS = model.IsSMS.HasValue ? model.IsSMS.Value : true;
                dbmodel.IsActive = model.IsActive.HasValue ? model.IsActive.Value : true;
                dbmodel.CreatedBy = model.CreatedBy;
                dbmodel.CreatedDate = model.CreatedDate;
                dbmodel.UpdatedBy = model.UpdatedBy;
                dbmodel.UpdatedDate = model.UpdatedDate;
                dbmodel.IPAddress = model.IPAddress;
                dbmodel.Type = model.Type;
                dbmodel.StartDate = model.StartDate;
                dbmodel.EndDate = model.EndDate;
                dbmodel.WeekDays = model.WeekDays;
                dataContext.AlertRuleSetups.Add(dbmodel);
                dataContext.SaveChanges();


                output.okay = true;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [Route("update")]
        public Output ReSetAlertRuleSetup(AlertRuleSetupModel model)
        {
            Output output = new Output();
            try
            {
                if (!util.isNull(model))
                {
                    if (!util.isNull(model.Id))
                    {
                        var dbEntry = dataContext.AlertRuleSetups.Find(model.Id);
                        dbEntry.Id = model.Id;
                        dbEntry.AlertText = model.AlertText;
                        dbEntry.Remarks = model.Remarks;
                        dbEntry.BuildingFkId = model.BuildingFkId;
                        dbEntry.ObjectFkId = model.ObjectFkId;
                        dbEntry.SelectedDataIds = model.SelectedDataIds;
                        dbEntry.Percentage = model.Percentage;
                        dbEntry.DataFieldFkId = model.DataFieldFkId;
                        dbEntry.Condition = model.Condition;
                        dbEntry.ThresholdValue = model.ThresholdValue;
                        dbEntry.Severity = model.Severity;
                        dbEntry.ReferenceValue = model.ReferenceValue;
                        dbEntry.FixedRuleByFMCC = model.FixedRuleByFMCC;
                        dbEntry.IsEmail = model.IsEmail.HasValue ? model.IsEmail.Value : true;
                        dbEntry.IsSMS = model.IsSMS.HasValue ? model.IsSMS.Value : true;
                        dbEntry.IsActive = model.IsActive.HasValue ? model.IsActive.Value : true;
                        dbEntry.CreatedBy = model.CreatedBy;
                        dbEntry.CreatedDate = model.CreatedDate;
                        dbEntry.UpdatedBy = model.UpdatedBy;
                        dbEntry.UpdatedDate = model.UpdatedDate;
                        dbEntry.IPAddress = model.IPAddress;
                        dbEntry.Type = model.Type;
                        dbEntry.StartDate = model.StartDate;
                        dbEntry.EndDate = model.EndDate;
                        dbEntry.WeekDays = model.WeekDays;


                        dataContext.SaveChanges();
                        output.okay = true;
                    }
                    else
                    {
                        output.okay = false;
                        output.message = string.Empty;
                    }
                }
                else
                {
                    output.okay = false;
                    output.message = string.Empty;

                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [Route("delete")]
        public Output UnSetAlertRuleSetup(AlertRuleSetupModel model)
        {
            Output output = new Output();
            try
            {
                if (!util.isNull(model))
                {
                    if (!util.isNull(model.Id))
                    {
                        var dbEntry = dataContext.AlertRuleSetups.Find(model.Id);
                        dataContext.AlertRuleSetups.Remove(dbEntry);
                        dataContext.SaveChanges();
                    }
                    else
                    {
                        output.okay = false;
                        output.message = string.Empty;
                    }
                }
                else
                {
                    output.okay = false;
                    output.message = string.Empty;

                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [HttpPost]
        [Route("readalluser")]
        public Output ReadAllUsers()
        {
            Output output = new Output();
            try
            {
                output.model = dataContext.Users.Select(e => new { id = e.Id, text = e.FullName }).Distinct().ToList();
                output.okay = true;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [HttpGet]
        [Route("block")]
        public Output ReadAllBlock(int siteId)
        {
            Output output = new Output();
            try
            {
                output.model = dataContext.Buildings.Where(x => x.SiteId == siteId).Select(e => new { id = e.Id, text = e.BuildingId, Latitude = e.Lattitude, Longitude = e.Longitude }).Distinct().ToList();
                output.okay = true;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [HttpGet]
        [Route("blockMap")]
        public Output ReadAllBlockMap(int siteId)
        {
            Output output = new Output();
            try
            {
                output.model = dataContext.Database.SqlQuery<BlockMapModel>(
                                                                           @"select Building.Id,
	                                                                               Building.BuildingId,
	                                                                               convert(decimal(9, 6),Building.Lattitude) as Latitude,
	                                                                               convert(decimal(9, 6),Building.Longitude) as Longitude,
                                                                                   case when exists (
                                                                                                        select top 1 * 
                                                                                                        from [dbo].[BuildingAlarmForward] inner join [Alarm]
                                                                                                        on [BuildingAlarmForward].StatusName = [Alarm].Itqf
                                                                                                        where [Alarm].FMCCStatus = 1
							                                                                            and [BuildingAlarmForward].BuildingFkId = Building.Id
                                                                                                    ) then cast(1 as bit) else cast(0 as bit) end as IsAlarmed,
		                                                                          (select top 1 [Site].[Name] from [Site] where [Site].Id = Building.SiteId) as SiteName
                                                                            from Building
                                                                            where 
                                                                            SiteId = " + siteId + @"
                                                                            and Lattitude is not null 
                                                                            and Longitude is not null
                                                                            ").ToList();
                //dataContext.Buildings.Where(x => x.SiteId == siteId).Select(e => new { id = e.Id, text = e.BuildingId, Latitude = e.Lattitude, Longitude = e.Longitude }).Distinct().ToList();
                output.okay = true;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [HttpGet]
        [Route("site")]
        public Output ReadAllSite()
        {
            Output output = new Output();
            try
            {
                output.model = dataContext.Sites.Select(e => new { id = e.Id, text = e.Name }).Distinct().ToList();
                output.okay = true;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [HttpPost]
        [Route("object")]
        public Output ReadAllObject(BuildingObjectData model)
        {
            Output output = new Output();
            try
            {
                if (!util.isNull(model))
                {
                    if (!util.isZero(model.BuildingFkId))
                    {
                        output.model = dataContext.BuildingObjectDatas.Where(ww => ww.BuildingFkId == model.BuildingFkId).Select(e => new { id = e.ObjectFkId, text = e.ObjectId }).Distinct().ToList();
                        output.okay = true;
                    }
                }
                else
                {
                    output.okay = false;
                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [HttpPost]
        [Route("datafield")]
        public Output ReadAllDataField(BuildingObjectData model)
        {
            Output output = new Output();
            try
            {
                if (!util.isNull(model))
                {
                    if (model.BuildingFkId > 0 && model.ObjectFkId > 0)
                    {
                        output.model = dataContext.BuildingObjectDatas.Where(ww => ww.BuildingFkId == model.BuildingFkId && ww.ObjectFkId == model.ObjectFkId).Select(e => new { id = e.DataFieldFkId, text = e.DataFieldId }).Distinct().ToList();
                        output.okay = true;
                    }
                }
                else
                {
                    output.okay = false;
                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }
        [HttpPost]
        [Route("tempdatafield")]
        public Output ReadTemperatureDataField(BuildingObjectData model)
        {
            Output output = new Output();
            string unit = null;
            var objectUnitMapping = dataContext.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == "Temperature");
            if (objectUnitMapping !=
                null)
            {
                unit = objectUnitMapping.UnitName;
            }
            else
            {
                unit = "c";
            }
            try
            {
                if (!util.isNull(model))
                {

                    output.model = dataContext.BuildingObjectDatas.Where(x => x.DataFieldUnit == unit && x.BuildingFkId == model.BuildingFkId).Select(e => new { id = e.DataFieldFkId, text = e.DataFieldId }).Distinct().ToList();
                    output.okay = true;
                }
                else
                {
                    output.okay = false;
                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }

        [HttpPost]
        [Route("postprocessingalert")]
        public void PostProcessingAlert(AlertProcessingInput input)
        {
            using (var client = new HttpClient())
            {
                string portalUrl = ConfigurationManager.AppSettings["PortalURL"];
                client.Timeout = TimeSpan.FromMinutes(10);
                client.BaseAddress = new Uri(portalUrl);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                try
                {
                    var e = client.PostAsJsonAsync("api/AlertData/PostAlert", input).Result;

                }
                catch (Exception ex)
                {
                }

            }
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (dataContext != null)
                {
                    dataContext.Dispose();
                }
            }
            base.Dispose(disposing);
        }
    }
}

