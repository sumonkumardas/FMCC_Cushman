using System;
using log4net;
using System.IO;
using System.Xml;
using System.Net;
using System.Text;
using Fmcc.Models;
using System.Linq;
using Fmcc.Security;
using System.Net.Mail;
using System.Reflection;
using System.Data.Entity;
using EntityFramework.Utilities;
using System.Collections.Generic;
using Fmcc.Models.EntityDataModel;
using System.ComponentModel.DataAnnotations;
using System.Data.Common;
using System.Data.Entity.Migrations;
using System.Net.Http;
using System.Web;
using System.Net.Http.Headers;
using Fmcc.Utility;
using Newtonsoft.Json.Linq;
using System.Collections.Specialized;
using System.Web.Mvc;

namespace Fmcc.Controllers.ServiceControllers
{
    public class AlertController : ApiBaseController
    {
        private readonly ILog logger;
        private FMCCDataContext dbContext;
        private List<AlertData> alertDataList;

        List<Alert> alerts = null;
        List<Alert> singlePointAlerts = null;
        List<ReadingUpdate> readingUpdates = null;


        public AlertController()
        {
            dbContext = new FMCCDataContext();
            alertDataList = new List<AlertData>();
            logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/getalertrulesetup")]
        public Output GetAlertRule()
        {
            Output output = new Output();
            try
            {
                List<AlertRuleSetupModel> alertRuleSetupList = dbContext.AlertRuleSetups.Select(e => new AlertRuleSetupModel
                {
                    Id = e.Id,
                    Remarks = e.Remarks,
                    Severity = e.Severity,
                    ObjectId = e.ObjectId,
                    AlertText = e.AlertText,
                    Condition = e.Condition,
                    ObjectFkId = e.ObjectFkId,
                    DataFieldId = e.DataFieldId,
                    DataFieldFkId = e.DataFieldFkId,
                    ThresholdValue = e.ThresholdValue,
                    ReferenceValue = e.ReferenceValue,
                    FixedRuleByFMCC = e.FixedRuleByFMCC,
                    Type = e.Type,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    WeekDays = e.WeekDays,
                }).ToList();
                output.okay = true;
                output.message = string.Empty;
                output.model = alertRuleSetupList;

            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/postalertrulesetup")]
        public Output SetAlertRule(AlertRuleSetupModel model)
        {
            Output output = new Output();
            try
            {
                if (model != null)
                {
                    if (model.Id >= 0)
                    {
                        List<AlertRuleSetup> alertRuleSetupList = dbContext.AlertRuleSetups.Where(w => w.BuildingFkId == model.BuildingFkId && w.ObjectFkId == model.ObjectFkId && w.DataFieldFkId == model.DataFieldFkId && w.Severity == model.Severity && w.Condition == model.Condition).ToList();
                        if (model.Id == 0 && alertRuleSetupList.Count == 0)
                        {
                            var dbmodel = new AlertRuleSetup();
                            string dataFieldId = model.DataFieldId;
                            int objectId = model.ObjectFkId.GetValueOrDefault();
                            var objectEntity = dbContext.Objects.Find(objectId);
                            var dataFieldIdEntity = dbContext.DataFields.Where(e => e.DataFieldId == dataFieldId).FirstOrDefault();

                            if (objectEntity != null)
                            {
                                dbmodel.ObjectFkId = objectEntity.Id;
                                dbmodel.ObjectId = objectEntity.ObjectId;
                            }

                            if (dataFieldIdEntity != null)
                            {
                                dbmodel.DataFieldFkId = dataFieldIdEntity.Id;
                                dbmodel.DataFieldId = dataFieldIdEntity.DataFieldId;
                            }

                            dbmodel.Remarks = model.Remarks;
                            dbmodel.Severity = model.Severity;
                            dbmodel.Condition = model.Condition;
                            dbmodel.AlertText = model.AlertText;
                            dbmodel.ThresholdValue = model.ThresholdValue;
                            dbmodel.ReferenceValue = model.ReferenceValue;
                            dbmodel.FixedRuleByFMCC = model.FixedRuleByFMCC;
                            dbmodel.Type = model.Type;
                            dbmodel.StartDate = model.StartDate;
                            dbmodel.EndDate = model.EndDate;
                            dbmodel.WeekDays = model.WeekDays;
                            dbContext.AlertRuleSetups.Add(dbmodel);
                            dbContext.SaveChanges();

                            output.okay = true;
                            output.message = "Data Saved Successfully.";
                            output.model = model;
                        }
                        else
                        {
                            var alertRuleSetup = dbContext.AlertRuleSetups.Find(model.Id);
                            if (alertRuleSetup != null)
                            {
                                int objectId = model.ObjectFkId.GetValueOrDefault();
                                string dataFieldId = model.DataFieldId;
                                var objectEntity = dbContext.Objects.Find(objectId);
                                var dataFieldIdEntity = dbContext.DataFields.Where(e => e.DataFieldId == dataFieldId).FirstOrDefault();

                                if (objectEntity != null)
                                {
                                    alertRuleSetup.ObjectFkId = objectEntity.Id;
                                    alertRuleSetup.ObjectId = objectEntity.ObjectId;
                                }

                                if (dataFieldIdEntity != null)
                                {
                                    alertRuleSetup.DataFieldFkId = dataFieldIdEntity.Id;
                                    alertRuleSetup.DataFieldId = dataFieldIdEntity.DataFieldId;
                                }

                                alertRuleSetup.Remarks = model.Remarks;
                                alertRuleSetup.Severity = model.Severity;
                                alertRuleSetup.AlertText = model.AlertText;
                                alertRuleSetup.Condition = model.Condition;
                                alertRuleSetup.ThresholdValue = model.ThresholdValue;
                                alertRuleSetup.ReferenceValue = model.ReferenceValue;
                                alertRuleSetup.FixedRuleByFMCC = model.FixedRuleByFMCC;
                                dbContext.SaveChanges();
                                if (model.AlertNotifyUser.Count > 0)
                                {
                                    foreach (int Id in model.AlertNotifyUser)
                                    {
                                        var user = dbContext.Users.Find(Id);
                                        if (user != null)
                                        {
                                            AlertNotifyUser alertNotifyUser = new AlertNotifyUser
                                            {
                                                AlertRuleSetupId = alertRuleSetup.Id,
                                                UserId = user.Id
                                            };
                                            dbContext.AlertNotifyUsers.Add(alertNotifyUser);
                                        }
                                    }
                                    dbContext.SaveChanges();
                                }
                                output.okay = true;
                                output.message = "Data Updated Successfully.";
                                output.model = alertRuleSetup;
                            }
                            else
                            {
                                output.okay = false;
                                output.model = null;
                                output.message = "Not specified.";
                            }
                        }
                    }
                    else
                    {
                        output.okay = false;
                        output.model = null;
                        output.message = "Invalid Model.";
                    }

                }
                else
                {
                    output.okay = false;
                    output.model = null;
                    output.message = "Not specified.";
                }
            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/deletealertrulesetup")]
        public Output DeleteAlertRuleSetup(AlertRuleSetupModel model)
        {

            Output output = new Output();
            try
            {
                if (model != null)
                {
                    if (model.Id > 0)
                    {
                        var dbmodel = dbContext.AlertRuleSetups.Find(model.Id);
                        if (dbmodel != null)
                        {
                            if (dbmodel.FixedRuleByFMCC.Value == true)
                            {
                                if (UserInfo.Roles.Split(',').Contains("Admin User") || UserInfo.Roles.Split(',').Contains("FMCC User"))
                                {
                                    dbContext.AlertRuleSetups.Remove(dbmodel);
                                }
                            }
                            else
                            {
                                dbContext.AlertRuleSetups.Remove(dbmodel);
                            }

                            dbContext.SaveChanges();
                            var users = dbContext.AlertNotifyUsers.Where(e => e.AlertRuleSetupId == model.Id).ToList();
                            foreach (var item in users)
                            {
                                dbContext.AlertNotifyUsers.Remove(item);
                            }
                            dbContext.SaveChanges();
                            output.okay = true;
                            output.model = null;
                            output.message = "Success.";
                        }
                        else
                        {
                            output.okay = false;
                            output.model = null;
                            output.message = "Item Not Found.";
                        }
                    }
                    else
                    {
                        output.okay = false;
                        output.model = null;
                        output.message = "Item Not Found.";
                    }
                }
                else
                {
                    output.okay = false;
                    output.model = null;
                    output.message = "Item Not Found.";
                }
            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;
        }

        //[HttpGet]
        //[Route("api/processalertdata")]
        //public void ProcessAlertData()
        //{
        //    try
        //    {
        //        //get a list of all active blocks. [Buildings represent the blocks of a Building]
        //        List<Building> blockList = dbContext.Buildings.Where(x => x.IsActive == true).ToList();

        //        foreach (var eachBlock in blockList)
        //        {
        //            //find a list of all active AlertRuleSetup for current block context.
        //            List<AlertRuleSetup> alertRuleSetupList = dbContext.AlertRuleSetups.Where(x => x.BuildingFkId == eachBlock.Id && x.IsActive == true).ToList();

        //            if (alertRuleSetupList.Count > 0)
        //            {
        //                //find a list of all un-processed TempReading for current block context.
        //                List<TempReading> readingList = (from blk in dbContext.Buildings
        //                                                 join tmpReading in dbContext.TempReadings
        //                                                 on eachBlock.Id equals tmpReading.BuildingFkId
        //                                                 where blk.Id == eachBlock.Id
        //                                                 &&
        //                                                 DbFunctions.CreateTime(tmpReading.Timestamp.Hour, tmpReading.Timestamp.Minute, tmpReading.Timestamp.Second) >=
        //                                                 DbFunctions.CreateTime(blk.WorkingPeriodStart.Value.Hour, blk.WorkingPeriodStart.Value.Minute, blk.WorkingPeriodStart.Value.Second)
        //                                                 &&
        //                                                 DbFunctions.CreateTime(tmpReading.Timestamp.Hour, tmpReading.Timestamp.Minute, tmpReading.Timestamp.Second) <=
        //                                                 DbFunctions.CreateTime(blk.WorkingPeriodEnd.Value.Hour, blk.WorkingPeriodEnd.Value.Minute, blk.WorkingPeriodEnd.Value.Second)
        //                                                 && (tmpReading.IsProcess == null || tmpReading.IsProcess == false)
        //                                                 select tmpReading).AsNoTracking().ToList();

        //                if (readingList.Count > 0)
        //                {
        //                    DateTime? minDate = dbContext.TempReadings.Where(x => x.BuildingFkId == eachBlock.Id && x.IsProcess == null || x.IsProcess == false).Min(x => x.Timestamp);
        //                    DateTime? maxdate = dbContext.TempReadings.Where(x => x.BuildingFkId == eachBlock.Id && x.IsProcess == null || x.IsProcess == false).Max(x => x.Timestamp);

        //                    foreach (AlertRuleSetup eachAlertRuleSetup in alertRuleSetupList)
        //                    {
        //                        //find all un-processed TempReading list for current AlertRuleSetup context of the current block context.
        //                        List<TempReading> alertReadings = readingList.Where(x => x.BuildingFkId == eachAlertRuleSetup.BuildingFkId && x.ObjectFkId == eachAlertRuleSetup.ObjectFkId && x.DataFieldFkId == eachAlertRuleSetup.DataFieldFkId).OrderBy(r => r.Timestamp).ToList();

        //                        foreach (TempReading eachAlertReading in alertReadings)
        //                        {
        //                            byte condition = 0;
        //                            if (eachAlertReading.Timestamp != null)
        //                            {
        //                                double valueInPercent = 0;
        //                                double readingValue = eachAlertReading.Value;
        //                                double referenceValue = eachAlertRuleSetup.ReferenceValue.GetValueOrDefault();
        //                                if (referenceValue != 0)
        //                                {
        //                                    valueInPercent = (100 * (readingValue - referenceValue)) / Math.Abs(referenceValue);
        //                                }

        //                                double getPercentageValueOfCustomValueOfThresholdValue = (referenceValue / 100) * readingValue;
        //                                getPercentageValueOfCustomValueOfThresholdValue = (referenceValue - getPercentageValueOfCustomValueOfThresholdValue);
        //                                condition = CheckAlertRuleCondition(valueInPercent, getPercentageValueOfCustomValueOfThresholdValue, byte.Parse(eachAlertRuleSetup.Condition.ToString()));
        //                            }

        //                            if (condition != 0)
        //                            {
        //                                SaveAlertData(eachAlertReading, eachAlertRuleSetup);
        //                            }
        //                        }
        //                    }

        //                    if (minDate != null && maxdate != null)
        //                    {
        //                        EFBatchOperation.For(dbContext, dbContext.TempReadings)
        //                            .Where(b => b.BuildingFkId == eachBlock.Id && b.Timestamp >= minDate && b.Timestamp <= maxdate &&
        //                            (b.IsProcess == null || b.IsProcess == false)).Update(b => b.IsProcess, b => true);
        //                    }
        //                }
        //            }
        //        }

        //        EFBatchOperation.For(dbContext, dbContext.AlertDatas).InsertAll(alertDataList);
        //    }
        //    catch (Exception exception)
        //    {
        //        logger.Error(exception.Message);
        //    }
        //}

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/mailalertdata")]
        public void MailAlertData()
        {
            try
            {
                var userList = dbContext.Users.Select(s => new { s.Id }).ToList();

                DateTime stime = DateTime.Now.Date;
                DateTime etime = stime.AddDays(1).AddSeconds(-1);

                string sDateTime = stime.ToString("yyyy-MM-dd HH:mm:ss");
                string eDateTime = etime.ToString("yyyy-MM-dd HH:mm:ss");


                List<AlertMailModel> alertMailModelList = (from alertData in dbContext.AlertDatas
                                                           join notifyUser in dbContext.AlertNotifyUsers on alertData.AlertRuleSetupId equals notifyUser.AlertRuleSetupId
                                                           join user in dbContext.Users on notifyUser.UserId equals user.Id
                                                           join blk in dbContext.Buildings on alertData.BuildingFkId equals blk.Id
                                                           join obj in dbContext.Objects on alertData.ObjectFkId equals obj.Id
                                                           join dataField in dbContext.DataFields on alertData.DataFieldFkId equals dataField.Id
                                                           join alertRuleSetup in dbContext.AlertRuleSetups on alertData.AlertRuleSetupId equals alertRuleSetup.Id   // here RoleId means alertRuleSetupID
                                                           where (alertData.IsProcess == null || alertData.IsProcess == false) && (alertData.Timestamp >= stime && alertData.Timestamp <= etime)   // here 1 for daily notification                      
                                                           orderby blk.Id, alertData.Timestamp, obj.Id, dataField.Id
                                                           select new AlertMailModel
                                                           {
                                                               UserId = user.Id,
                                                               FullName = user.FullName,
                                                               Email = user.Email,
                                                               Severity = alertData.Severity,
                                                               BuildingFkId = blk.Id,
                                                               BuildingName = blk.Name,
                                                               ObjectName = obj.Name,
                                                               DatafieldName = dataField.Name,
                                                               ReadingValue = alertData.ReadingValue,
                                                               //BaselineValue = alertData.BaselineValue,
                                                               Timestamp = alertData.Timestamp,
                                                               IsEmail = alertData.IsEmail,
                                                               IsSMS = alertData.IsSMS,
                                                               MobileNo = user.MobileNo,
                                                               Condition = alertData.Condition,
                                                               AlertRoleValue = alertData.ReferencValue,
                                                               //BaselineRange = bl.BaselineRange,
                                                               AlertText = alertRuleSetup.AlertText
                                                           }).ToList();



                var userIdWiseAlertMailModel = alertMailModelList.OrderBy(o => o.UserId).ToList();

                var timeWiseAlertMailModelList = alertMailModelList.OrderBy(o => o.Timestamp).ToList();

                var disinctUserIdList = alertMailModelList.Select(x => x.UserId).Distinct().ToList();

                var justUserTimeSTampList = alertMailModelList.Select(x => x.Timestamp).Distinct().ToList();

                var mainAlertDataList = new List<AlertDataResult>();

                foreach (var al in alertMailModelList)
                {
                    AlertDataResult adr = new AlertDataResult();
                    adr.UserId = al.UserId;
                    adr.FullName = al.FullName;
                    adr.Email = al.Email;
                    adr.Severity = al.Severity.ToString();
                    adr.blFkId = al.BuildingFkId;
                    adr.BuildingName = al.BuildingName;
                    adr.objName = al.ObjectName;
                    adr.DataFieldName = al.DatafieldName;
                    adr.ReadingValue = al.ReadingValue.GetValueOrDefault();
                    adr.BaselineValue = "0";
                    adr.Timestamp = al.Timestamp;
                    adr.IsEmail = al.IsEmail.GetValueOrDefault();
                    adr.IsSMS = al.IsSMS;
                    adr.MobileNo = al.MobileNo;
                    adr.Condition = al.Condition.ToString();
                    adr.AlertRoleValue = al.AlertRoleValue.GetValueOrDefault();
                    adr.BaselineRange = "0";
                    adr.AlertText = (al.AlertText == null) ? "" : al.AlertText;
                    mainAlertDataList.Add(adr);
                }

                List<AlertDataResult> alertDataResultist = MinuteWiseAlertDataConfigure.GetMinuteWiseAlertDataList(disinctUserIdList, mainAlertDataList);

                var alertDataListForNotificitiona = alertDataResultist.OrderBy(r => r.UserId).ThenBy(r => r.Timestamp).ToList();  // ordering according to user id

                DbContextTransaction dbcontext = null;
                FMCCDataContext dbc = null;

                string mailTemplateType = System.Configuration.ConfigurationManager.AppSettings["MailTemplateType"];
                foreach (var usr in userList)
                {
                    string filename = HttpContext.Current.Server.MapPath("/Templates/mailstructure.html");
                    string mailbody = File.ReadAllText(filename);
                    StringBuilder mbody = new StringBuilder();
                    StringBuilder mainBody = new StringBuilder();
                    string alertStatus = "", emailAddress = "", fullName = "", mobileNo = "";
                    bool emailStatus = false;
                    bool? isSMS = false;
                    StringBuilder smsText = new StringBuilder();
                    string alertText = string.Empty;

                    List<AlertDataResult> mailreceiverAlertDatalist = alertDataListForNotificitiona.Where(x => x.UserId == usr.Id).ToList();



                    if (mailreceiverAlertDatalist.Count > 0)
                    {
                        dbc = new FMCCDataContext();
                        dbcontext = dbc.Database.BeginTransaction();
                    }

                    int sl = 1; int s = 1; DateTime? fromDate = null; double? lastRecord = null; int rowIndex = 0;
                    for (int r = 0; r < mailreceiverAlertDatalist.Count; r++)
                    {
                        int alHour = mailreceiverAlertDatalist[r].Timestamp.Value.Hour;
                        int alMin = mailreceiverAlertDatalist[r].Timestamp.Value.Minute;
                        int alSec = mailreceiverAlertDatalist[r].Timestamp.Value.Second;

                        if (mailreceiverAlertDatalist[r].IsEmail == true && mailreceiverAlertDatalist[r].Email != null)
                        {
                            if (mainBody.Length != 0)
                            {
                                if (s == mailreceiverAlertDatalist.Count) s--;

                                while (s <= mailreceiverAlertDatalist.Count)
                                {
                                    int talHour = mailreceiverAlertDatalist[s].Timestamp.Value.Hour;
                                    int talMin = mailreceiverAlertDatalist[s].Timestamp.Value.Minute;
                                    int talSec = mailreceiverAlertDatalist[s].Timestamp.Value.Second;

                                    TimeSpan ts = TimeSpan.Parse(talHour.ToString() + ":" + talMin.ToString() + ":" + talSec.ToString()) - TimeSpan.Parse(alHour.ToString() + ":" + alMin.ToString() + ":" + alSec.ToString());
                                    int tsMinute = ts.Minutes;
                                    int tsHour = ts.Hours;
                                    if (tsHour == 0 && tsMinute == 1)
                                    {
                                        if (fromDate == null)
                                        {
                                            rowIndex = r;
                                            fromDate = DateTime.Parse(mailreceiverAlertDatalist[r].Timestamp.ToString());
                                        }

                                        s++;
                                        break;
                                    }
                                    else
                                    {
                                        if (s != mailreceiverAlertDatalist.Count - 1) s--;

                                        DateTime from_Dates = DateTime.Parse(fromDate.ToString());
                                        DateTime to_Dates = DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString());

                                        var timer = to_Dates - from_Dates;

                                        int counter = int.Parse(timer.TotalMinutes.ToString()) + 1;    // because (4/25/2016 10:51:00 AM - 4/25/2016 10:48:00 AM) output is 3 mint.but range is 4 so form (48 to 51) so always add extra 1 . to get actual value
                                        if (counter >= int.Parse(mailreceiverAlertDatalist[s].BaselineRange.ToString()))
                                        {
                                            mbody = new StringBuilder();
                                            int? severity = MinuteWiseAlertDataConfigure.GetMoreOccuredSeverity(rowIndex, s, mailreceiverAlertDatalist);
                                            alertStatus = MinuteWiseAlertDataConfigure.GetAlertStatus(int.Parse(mailreceiverAlertDatalist[rowIndex].Severity.ToString()));
                                            string getCondition = MinuteWiseAlertDataConfigure.GetCondition(int.Parse(mailreceiverAlertDatalist[rowIndex].Condition.ToString()), mailreceiverAlertDatalist[rowIndex].AlertRoleValue.ToString());

                                            if (getCondition == "Deviation") getCondition = MinuteWiseAlertDataConfigure.FindOutBelowAboveByDeviative(double.Parse(mailreceiverAlertDatalist[rowIndex].ReadingValue.ToString()), double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), mailreceiverAlertDatalist[rowIndex].AlertRoleValue.ToString());

                                            mbody.Append(
                                               "<br /><div>" +
                                               " <table> " +
                                               "<tr> <td>ITEM No:</td>   <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td> <td>#" + sl + "</td> </tr>" +
                                               "<tr> <td>Alert Text:</td>  <td>&nbsp;</td> <td> " + mailreceiverAlertDatalist[rowIndex].AlertText + " </td></tr>" +
                                               "<tr> <td>From Date:</td> <td>&nbsp;</td>  <td>" + DateTime.Parse(fromDate.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "</td></tr>" +
                                               "<tr> <td>To Date:</td> <td>&nbsp;</td>  <td>" + DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "</td></tr>" +
                                               "<tr> <td>SEVERITY:</td>   <td>&nbsp;</td>   <td>" + alertStatus + "</td></tr>" +
                                               "<tr> <td>DATA POINT:</td>  <td>&nbsp;</td>  <td> " + mailreceiverAlertDatalist[rowIndex].objName + " " + mailreceiverAlertDatalist[rowIndex].DataFieldName + "</td></tr>" +
                                               "<tr> <td>LAST RECORD:</td>  <td>&nbsp;</td> <td>" + lastRecord + "</td></tr>" +
                                               "<tr> <td>REFERENCE VALUE:</td> <td>&nbsp;</td> <td>" + Math.Round(double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), 3) + "</td> </tr>" +
                                               "<tr> <td>RULE:</td><td>&nbsp;</td> <td>" + getCondition + "</td></tr>" +
                                               "</table>" +
                                               "</div>");

                                            smsText.Append("\r\n\r\nITEM No:\t #" + sl + "" +
                                                " \r\nAlert Text:\t " + mailreceiverAlertDatalist[rowIndex].AlertText + "" +
                                                " \r\nFROM DATE:\t " + DateTime.Parse(fromDate.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "" +
                                                " \r\nTO DATE:\t " + DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "" +
                                                " \r\nSEVERITY:\t " + alertStatus + "" +
                                                " \r\nDATA POINT:\t " + mailreceiverAlertDatalist[rowIndex].objName + " " + mailreceiverAlertDatalist[rowIndex].DataFieldName + "" +
                                                " \r\nLAST RECORD:\t " + lastRecord + "" +
                                                " \r\nREFERENCE VALUE:\t " + Math.Round(double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), 3) + "" +
                                                " \r\nRULE:\t\t " + getCondition + "");


                                            lastRecord = Math.Round(double.Parse(mailreceiverAlertDatalist[s].ReadingValue.ToString()), 3);
                                            s = s + 2;
                                            fromDate = null;
                                            mainBody.Append(mbody.ToString());
                                            sl++;
                                            break;
                                        }
                                        s = s + 2;
                                        break;
                                    }


                                }
                            }
                            else if (mainBody.Length == 0 && r == mailreceiverAlertDatalist.Count - 1)
                            {
                                DateTime? ToDate = null;
                                DateTime from_Dates = DateTime.Parse(mailreceiverAlertDatalist[rowIndex].Timestamp.ToString());
                                s = r;
                                DateTime to_Dates = DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString());

                                var timer = to_Dates - from_Dates;

                                int counter = int.Parse(timer.TotalMinutes.ToString()) + 1;    // because (4/25/2016 10:51:00 AM - 4/25/2016 10:48:00 AM) output is 3 mint.but range is 4 so form (48 to 51) so always add extra 1 . to get actual value
                                if (counter >= int.Parse(mailreceiverAlertDatalist[s].BaselineRange.ToString()))
                                {
                                    lastRecord = Math.Round(double.Parse(mailreceiverAlertDatalist[s].ReadingValue.ToString()), 3);
                                    mbody = new StringBuilder();
                                    ToDate = DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString());
                                    int? severity = MinuteWiseAlertDataConfigure.GetMoreOccuredSeverity(0, s, mailreceiverAlertDatalist);
                                    // alertStatus = GetAlertStatus(int.Parse(mailreceiverAlertDatalist[0].Severity.ToString()));
                                    alertStatus = MinuteWiseAlertDataConfigure.GetAlertStatus(int.Parse(severity.ToString()));
                                    string getCondition = MinuteWiseAlertDataConfigure.GetCondition(int.Parse(mailreceiverAlertDatalist[rowIndex].Condition.ToString()), mailreceiverAlertDatalist[rowIndex].AlertRoleValue.ToString());

                                    if (getCondition == "Deviation") getCondition = MinuteWiseAlertDataConfigure.FindOutBelowAboveByDeviative(double.Parse(mailreceiverAlertDatalist[rowIndex].ReadingValue.ToString()), double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), mailreceiverAlertDatalist[rowIndex].AlertRoleValue.ToString());

                                    mbody.Append("<div>Dear " + mailreceiverAlertDatalist[rowIndex].FullName + ",</div><br />");
                                    mbody.Append("<div>Following is the Alert recorded for " + DateTime.Parse(mailreceiverAlertDatalist[rowIndex].Timestamp.ToString()).ToString("dd-MM-yyyy") + ".</div><br />");


                                    mbody.Append(
                                      "<div>" +
                                      " <table> " +
                                      "<tr> <td>ITEM No:</td>   <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td> <td>#" + sl + "</td> </tr>" +
                                      "<tr> <td>Alert Text:</td>  <td>&nbsp;</td> <td> " + mailreceiverAlertDatalist[rowIndex].AlertText + " </td></tr>" +
                                      "<tr> <td>FROM DATE:</td> <td>&nbsp;</td>  <td>" + DateTime.Parse(mailreceiverAlertDatalist[rowIndex].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "</td></tr>" +
                                       "<tr> <td>TO DATE:</td> <td>&nbsp;</td>  <td>" + DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "</td></tr>" +
                                      "<tr> <td>SEVERITY:</td>   <td>&nbsp;</td>   <td>" + alertStatus + "</td></tr>" +
                                      "<tr> <td>DATA POINT:</td>  <td>&nbsp;</td>  <td> " + mailreceiverAlertDatalist[rowIndex].objName + " " + mailreceiverAlertDatalist[rowIndex].DataFieldName + "</td></tr>" +
                                      "<tr> <td>LAST RECORD:</td>  <td>&nbsp;</td> <td> NA </td></tr>" +
                                      "<tr> <td>REFERENCE VALUE:</td> <td>&nbsp;</td> <td>" + Math.Round(double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), 3) + "</td> </tr>" +
                                      "<tr> <td>RULE:</td><td>&nbsp;</td> <td>" + getCondition + "</td></tr>" +
                                      "</table>" +
                                      "</div>");

                                    smsText.Append("ITEM No:\t #" + sl + " " +
                                    " \r\nAlert Text:\t " + mailreceiverAlertDatalist[rowIndex].AlertText + "" +
                                    " \r\nFROM DATE:\t " + DateTime.Parse(mailreceiverAlertDatalist[rowIndex].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "" +
                                    " \r\nTO DATE:\t " + DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + " " +
                                    "\r\nSEVERITY:\t " + alertStatus + "" +
                                    " \r\nDATA POINT:\t " + mailreceiverAlertDatalist[rowIndex].objName + " " + mailreceiverAlertDatalist[rowIndex].DataFieldName + "" +
                                    " \r\nLAST RECORD:\t NA " +
                                    " \r\nREFERENCE VALUE:\t " + Math.Round(double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), 3) + "" +
                                    " \r\nRULE:\t\t " + getCondition + "");
                                    s = 1;
                                    mainBody.Append(mbody.ToString());
                                    //sl++;
                                    fromDate = null;
                                    // break;
                                }

                            }
                            else
                            {
                                if (fromDate == null)
                                {
                                    rowIndex = r;
                                    fromDate = DateTime.Now;
                                }

                                DateTime? ToDate = null;
                                while (s < mailreceiverAlertDatalist.Count)
                                {
                                    int talHour = mailreceiverAlertDatalist[s].Timestamp.Value.Hour;
                                    int talMin = mailreceiverAlertDatalist[s].Timestamp.Value.Minute;
                                    int talSec = mailreceiverAlertDatalist[s].Timestamp.Value.Second;

                                    TimeSpan ts = TimeSpan.Parse(talHour.ToString() + ":" + talMin.ToString() + ":" + talSec.ToString()) - TimeSpan.Parse(alHour.ToString() + ":" + alMin.ToString() + ":" + alSec.ToString());
                                    int tsMinute = ts.Minutes;
                                    int tsHour = ts.Hours;
                                    if (tsHour == 0 && tsMinute == 1)
                                    {
                                        ToDate = DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString());
                                        s++; break;
                                    }
                                    else
                                    {
                                        s--;

                                        DateTime from_Dates = DateTime.Parse(mailreceiverAlertDatalist[rowIndex].Timestamp.ToString());
                                        DateTime to_Dates = DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString());

                                        var timer = to_Dates - from_Dates;

                                        int counter = int.Parse(timer.TotalMinutes.ToString()) + 1;    // because (4/25/2016 10:51:00 AM - 4/25/2016 10:48:00 AM) output is 3 mint.but range is 4 so form (48 to 51) so always add extra 1 . to get actual value
                                        if (counter >= int.Parse(mailreceiverAlertDatalist[s].BaselineRange.ToString()))
                                        {
                                            lastRecord = Math.Round(double.Parse(mailreceiverAlertDatalist[s].ReadingValue.ToString()), 3);
                                            mbody = new StringBuilder();
                                            ToDate = DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString());
                                            int? severity = MinuteWiseAlertDataConfigure.GetMoreOccuredSeverity(0, s, mailreceiverAlertDatalist);
                                            // alertStatus = GetAlertStatus(int.Parse(mailreceiverAlertDatalist[0].Severity.ToString()));
                                            alertStatus = MinuteWiseAlertDataConfigure.GetAlertStatus(int.Parse(severity.ToString()));
                                            string getCondition = MinuteWiseAlertDataConfigure.GetCondition(int.Parse(mailreceiverAlertDatalist[rowIndex].Condition.ToString()), mailreceiverAlertDatalist[rowIndex].AlertRoleValue.ToString());

                                            if (getCondition == "Deviation") getCondition = MinuteWiseAlertDataConfigure.FindOutBelowAboveByDeviative(double.Parse(mailreceiverAlertDatalist[rowIndex].ReadingValue.ToString()), double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), mailreceiverAlertDatalist[rowIndex].AlertRoleValue.ToString());

                                            mbody.Append("<div>Dear " + mailreceiverAlertDatalist[rowIndex].FullName + ",</div><br />");
                                            mbody.Append("<div>Following is the Alert recorded for " + DateTime.Parse(mailreceiverAlertDatalist[rowIndex].Timestamp.ToString()).ToString("dd-MM-yyyy") + ".</div><br />");


                                            mbody.Append(
                                              "<div>" +
                                              " <table> " +
                                              "<tr> <td>ITEM No:</td>   <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td> <td>#" + sl + "</td> </tr>" +
                                              "<tr> <td>Alert Text:</td>  <td>&nbsp;</td> <td> " + mailreceiverAlertDatalist[rowIndex].AlertText + " </td></tr>" +
                                              "<tr> <td>FROM DATE:</td> <td>&nbsp;</td>  <td>" + DateTime.Parse(mailreceiverAlertDatalist[rowIndex].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "</td></tr>" +
                                               "<tr> <td>TO DATE:</td> <td>&nbsp;</td>  <td>" + DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "</td></tr>" +
                                              "<tr> <td>SEVERITY:</td>   <td>&nbsp;</td>   <td>" + alertStatus + "</td></tr>" +
                                              "<tr> <td>DATA POINT:</td>  <td>&nbsp;</td>  <td> " + mailreceiverAlertDatalist[rowIndex].objName + " " + mailreceiverAlertDatalist[rowIndex].DataFieldName + "</td></tr>" +
                                              "<tr> <td>LAST RECORD:</td>  <td>&nbsp;</td> <td> NA </td></tr>" +
                                              "<tr> <td>REFERENCE VALUE:</td> <td>&nbsp;</td> <td>" + Math.Round(double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), 3) + "</td> </tr>" +
                                              "<tr> <td>RULE:</td><td>&nbsp;</td> <td>" + getCondition + "</td></tr>" +
                                              "</table>" +
                                              "</div>");

                                            smsText.Append("ITEM No:\t #" + sl + " " +
                                            " \r\nAlert Text:\t " + mailreceiverAlertDatalist[rowIndex].AlertText + "" +
                                            " \r\nFROM DATE:\t " + DateTime.Parse(mailreceiverAlertDatalist[rowIndex].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + "" +
                                            " \r\nTO DATE:\t " + DateTime.Parse(mailreceiverAlertDatalist[s].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss tt") + " " +
                                            "\r\nSEVERITY:\t " + alertStatus + "" +
                                            " \r\nDATA POINT:\t " + mailreceiverAlertDatalist[rowIndex].objName + " " + mailreceiverAlertDatalist[rowIndex].DataFieldName + "" +
                                            " \r\nLAST RECORD:\t NA " +
                                            " \r\nREFERENCE VALUE:\t " + Math.Round(double.Parse(mailreceiverAlertDatalist[rowIndex].BaselineValue.ToString()), 3) + "" +
                                            " \r\nRULE:\t\t " + getCondition + "");
                                            s = s + 2;
                                            mainBody.Append(mbody.ToString());
                                            sl++;
                                            fromDate = null;
                                            break;
                                        }
                                        s = s + 2;
                                        fromDate = null;
                                        break;
                                    }
                                }
                            }


                            emailStatus = true;
                            emailAddress = mailreceiverAlertDatalist[r].Email;
                            emailAddress = "dev.rupaisafi@gmail.com";
                            fullName = mailreceiverAlertDatalist[r].FullName;
                            mobileNo = mailreceiverAlertDatalist[r].MobileNo;
                            isSMS = mailreceiverAlertDatalist[r].IsSMS;

                            if (dbc != null)
                            {
                                string timeStamp = DateTime.Parse(mailreceiverAlertDatalist[r].Timestamp.ToString()).ToString("dd-MM-yyyy hh:mm:ss");
                                string script = @"UPDATE AlertData SET IsProcess = 1 WHERE BuildingFkId=" + mailreceiverAlertDatalist[r].blFkId + " AND Format(Timestamp,'dd-MM-yyyy hh:mm:ss')='" + timeStamp + "'";

                                logger.Debug("update script" + script);
                                dbc.Database.ExecuteSqlCommand(script);
                            }
                        }
                    }

                    mailbody = mailbody.Replace("##tbl##", mainBody.ToString());

                    if (emailStatus)
                    {
                        try
                        {
                            if (SendBulkEmail(emailAddress, mailbody.ToString(), fullName, mobileNo, smsText.ToString(), isSMS))
                            {
                                if (dbc != null) dbc.SaveChanges();
                                if (dbcontext != null) dbcontext.Commit();
                            }
                            else if (dbcontext != null) dbcontext.Rollback();
                        }
                        catch (Exception exception)
                        {
                            logger.Error(exception.Message);
                            logger.Error(exception.InnerException);
                            if (dbcontext != null) dbcontext.Rollback();
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
            }
        }

        private void SendSms(string fullName, string mobileNo, string smsText)
        {
            try
            {
                string _smsxml = @"<?xml version=""1.0"" encoding=""utf-16"" ?><soap:Envelope xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"">" +
                           @"<soap:Body><SendSMS2 xmlns = ""http://tempuri.org/"">" +
                               "<userName>trial.sayleng</userName>" +
                               "<password>p@ssw0rd</password>" +
                               "<toMobile>" + mobileNo + "</toMobile>" +
                               "<recipientName>" + fullName + "</recipientName>" +
                               "<senderID>Daily alert notification</senderID>" +
                               "<smsText>" + smsText + "</smsText>" +
                               "<SMSType>S1</SMSType>" +
                               "<Apptype>a1</Apptype>" +
                               "<taskName>BCA Alert</taskName>" +
                               "<timeOffset>0</timeOffset>" +
                               "<priority>3</priority>" +
                               "</SendSMS2>" +
                           "</soap:Body>" +
                           "</soap:Envelope>";

                HttpWebRequest request = CreateWebRequest();
                XmlDocument soapEnvelopeXml = new XmlDocument();
                soapEnvelopeXml.LoadXml(_smsxml);

                using (Stream stream = request.GetRequestStream())
                {
                    soapEnvelopeXml.Save(stream);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                    {
                        string soapResult = rd.ReadToEnd();
                        //Debug.WriteLine(soapResult);
                    }
                }
            }

            catch (System.Exception exception)
            {
                logger.Error(exception.Message);

            }
        }

        public static HttpWebRequest CreateWebRequest()
        {
            try
            {
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(@"https://si.rapidsms.net/api/mysms.asmx?op=SendSMS2");
                webRequest.Headers.Add(@"SOAP:Action");
                webRequest.ContentType = "text/xml;charset=\"utf-8\"";
                webRequest.Accept = "text/xml";
                webRequest.Method = "POST";
                return webRequest;
            }
            catch (Exception)
            {

                throw;
            }

        }

        private bool SendBulkEmail(string ToEmailAddress, string mailBody, string fullName, string mobileNo, string smsText, bool? isSMS)
        {
            try
            {
                using (MailMessage message = new MailMessage("s3innovates@gmail.com", ToEmailAddress))
                {
                    message.Subject = "Daily alert notification";

                    message.BodyEncoding = Encoding.UTF8;
                    message.IsBodyHtml = true;
                    message.Body = mailBody;
                    SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
                    NetworkCredential basicCredential = new NetworkCredential("s3innovates@gmail.com", "123456789s3@s3innovate.com");
                    client.EnableSsl = true;
                    client.UseDefaultCredentials = true;
                    client.Credentials = basicCredential;
                    try
                    {
                        client.Send(message);
                        //  if (isSMS == true && mobileNo != null) SendSms(fullName, mobileNo, smsText);
                        return true;
                    }
                    catch (Exception ex)
                    {
                        logger.Error(ex.Message);
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return false;
            }
        }

        private void SaveAlertData(TempReading reading, AlertRuleSetup alertRuleSetup)
        {
            try
            {
                if (reading != null && alertRuleSetup != null)
                {
                    List<AlertData> alartDataList = alertDataList.Where(
                        x =>
                        x.BuildingFkId.Equals(reading.BuildingFkId) &&
                        x.ObjectFkId.Equals(reading.ObjectFkId) &&
                        x.DataFieldFkId.Equals(reading.DataFieldFkId) &&
                        x.Timestamp.Equals(reading.Timestamp) &&
                        x.ReadingValue.Equals(reading.Value)).ToList();

                    if (alertDataList.Count > 0)
                    {
                        foreach (AlertData alertData in alartDataList)
                        {
                            if (alertData.Severity < alertRuleSetup.Severity)
                            {
                                alertDataList.RemoveAll(x => x.BuildingFkId == reading.BuildingFkId && x.ObjectFkId == reading.ObjectFkId && x.DataFieldFkId == reading.DataFieldFkId && x.Timestamp == reading.Timestamp && x.ReadingValue == reading.Value);

                                var ad = new AlertData();
                                ad.BuildingFkId = reading.BuildingFkId;
                                ad.BuildingId = reading.BuildingId;
                                ad.ObjectFkId = reading.ObjectFkId;
                                ad.ObjectId = reading.ObjectId;
                                ad.DataFieldFkId = reading.DataFieldFkId;
                                ad.DataFieldId = reading.DataFieldId;
                                ad.ReadingValue = reading.Value;
                                ad.ReferencValue = alertRuleSetup.ReferenceValue;
                                ad.Timestamp = reading.Timestamp;
                                ad.Severity = alertRuleSetup.Severity;
                                ad.AlertRuleSetupId = alertRuleSetup.Id;
                                ad.IsEmail = alertRuleSetup.IsEmail;
                                ad.IsSMS = alertRuleSetup.IsSMS;
                                ad.IsProcess = false;
                                ad.CreatedDate = DateTime.Now;
                                ad.UpdatedDate = DateTime.Now;
                                ad.IsActive = false;
                                ad.IsProcess = false;
                                ad.Condition = alertRuleSetup.Condition;
                                ad.ReferencValue = alertRuleSetup.ThresholdValue;
                                alertDataList.Add(ad);
                            }
                        }
                        if (alartDataList.Count == 0)
                        {
                            var ad = new AlertData();
                            ad.BuildingFkId = reading.BuildingFkId;
                            ad.BuildingId = reading.BuildingId;
                            ad.ObjectFkId = reading.ObjectFkId;
                            ad.ObjectId = reading.ObjectId;
                            ad.DataFieldFkId = reading.DataFieldFkId;
                            ad.DataFieldId = reading.DataFieldId;
                            ad.ReadingValue = reading.Value;
                            ad.ReferencValue = alertRuleSetup.ReferenceValue;
                            ad.Timestamp = reading.Timestamp;
                            ad.Severity = alertRuleSetup.Severity;
                            ad.AlertRuleSetupId = alertRuleSetup.Id;
                            ad.IsEmail = alertRuleSetup.IsEmail;
                            ad.IsSMS = alertRuleSetup.IsSMS;
                            ad.IsProcess = false;
                            ad.CreatedDate = DateTime.Now;
                            ad.UpdatedDate = DateTime.Now;
                            ad.IsProcess = false;
                            ad.IsActive = false;
                            ad.Condition = alertRuleSetup.Condition;
                            ad.ReferencValue = alertRuleSetup.ThresholdValue;
                            alertDataList.Add(ad);
                        }
                    }
                    else
                    {
                        var ad = new AlertData();
                        ad.BuildingFkId = reading.BuildingFkId;
                        ad.BuildingId = reading.BuildingId;
                        ad.ObjectFkId = reading.ObjectFkId;
                        ad.ObjectId = reading.ObjectId;
                        ad.DataFieldFkId = reading.DataFieldFkId;
                        ad.DataFieldId = reading.DataFieldId;
                        ad.ReadingValue = reading.Value;
                        ad.ReferencValue = alertRuleSetup.ReferenceValue;
                        ad.Timestamp = reading.Timestamp;
                        ad.Severity = alertRuleSetup.Severity;
                        ad.AlertRuleSetupId = alertRuleSetup.Id;
                        ad.IsEmail = alertRuleSetup.IsEmail;
                        ad.IsSMS = alertRuleSetup.IsSMS;
                        ad.IsProcess = false;
                        ad.CreatedDate = DateTime.Now;
                        ad.UpdatedDate = DateTime.Now;
                        ad.IsProcess = false;
                        ad.Condition = alertRuleSetup.Condition;
                        ad.ReferencValue = alertRuleSetup.ThresholdValue;
                        alertDataList.Add(ad);
                    }

                }
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
            }
        }

        private byte CheckAlertRuleCondition(double valueInPercent, double alertRuleValueInPercent, byte condition)
        {
            try
            {
                // Above=1
                // Below=2
                // Deviation=3
                switch (condition)
                {
                    case 1:
                        if (valueInPercent > alertRuleValueInPercent) return 1;
                        else return 0;
                    case 2:
                        if (valueInPercent < alertRuleValueInPercent) return 2;
                        else return 0;
                    case 3:
                        if (valueInPercent > alertRuleValueInPercent) return 3;
                        if (valueInPercent < alertRuleValueInPercent) return 3;
                        else return 0;
                    default:
                        return 0;
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return 0;
            }
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/readsuppress")]
        public Output ReadSuppress()
        {
            Output output = new Output();
            try
            {
                var model = dbContext.AlertSuppresses.ToList();
                output.model = model.Select(e => new { Id = e.Id, StartDate = e.From_Date, EndDate = e.to_Date, BuildingId = e.BuildingId, BuildingFkId = e.BuildingFkId });
                output.okay = true;
            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
            }
            return output;
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/createsuppress")]
        public Output CrateSuppress(AlertSuppress model)
        {
            Output output = new Output();
            if (ModelState.IsValid)
            {
                var model1 = new AlertSuppress
                {
                    From_Date = model.From_Date,
                    to_Date = model.to_Date,
                    BuildingFkId = model.BuildingFkId,
                    BuildingId = model.BuildingId
                };
                dbContext.AlertSuppresses.Add(model1);
                dbContext.SaveChanges();
                output.okay = true;
            }
            else
            {
                output.okay = false;
                output.message = "error";
            }
            return output;
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/updatesuppress")]
        public Output UpdateSuppress(AlertSuppress model)
        {
            Output output = new Output();
            if (ModelState.IsValid)
            {
                var dbmodel = dbContext.AlertSuppresses.Find(model.Id);
                if (dbmodel != null)
                {
                    dbmodel.From_Date = model.From_Date;
                    dbmodel.to_Date = model.to_Date;
                    dbContext.SaveChanges();
                    output.okay = true;
                }
                else
                {
                    output.model = false;
                }
                output.model = false;
            }
            return output;
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/removesuppress")]
        public Output RemoveSuppress(AlertSuppress model)
        {
            Output output = new Output();
            if (model != null)
            {
                if (model.Id > 0)
                {
                    var dbmodel = dbContext.AlertSuppresses.Find(model.Id);
                    if (dbmodel != null)
                    {
                        dbmodel.From_Date = model.From_Date;
                        dbmodel.to_Date = model.to_Date;
                        dbContext.SaveChanges();
                        output.okay = true;
                    }
                    else
                    {
                        output.okay = false;
                    }
                    output.okay = false;
                }
                else
                {
                    output.okay = false;
                }
            }
            else
            {
                output.okay = false;
            }
            return output;
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/mailalertdata")]
        public Output RemoveSuppress()
        {
            var output = new Output();
            output.model = dbContext.AlertSuppresses.ToList();
            return output;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (dbContext != null)
                {
                    dbContext.Dispose();
                }
            }
            base.Dispose(disposing);
        }

        

        /// <summary>
        /// Load alert lists
        /// </summary>
        /// <returns></returns>
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/alert/loadalertlist")]
        public object LoadAlertList()
        {

            DateTime? endDate = null;
            DateTime? startDate = null;
            int start = 0;
            int siteId = 1;
            int length = 10;
            int alertRule = 0;
            int blockId = 0;
            var queryString = Request.GetQueryNameValuePairs()
                .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
            if (queryString.ContainsKey("blockId"))
            {
                if (!string.IsNullOrEmpty(queryString["blockId"]))
                {
                    blockId = Convert.ToInt32(queryString["blockId"]);
                }
            }
            if (queryString.ContainsKey("start"))
            {
                if (!string.IsNullOrEmpty(queryString["start"]))
                {
                    start = Convert.ToInt32(queryString["start"]);
                }
            }
            if (queryString.ContainsKey("siteId"))
            {
                if (!string.IsNullOrEmpty(queryString["siteId"]))
                {
                    siteId = Convert.ToInt32(queryString["siteId"]);
                }
            }
            if (queryString.ContainsKey("alertRule"))
            {
                if (!string.IsNullOrEmpty(queryString["alertRule"]))
                {
                    alertRule = Convert.ToInt32(queryString["alertRule"]);
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


            try
            {
                var query = dbContext.Alerts.Where(e => e.Id != 0);

                if (startDate != null && endDate != null)
                {
                    query = query.Where(e => e.FromDateTime >= startDate && e.FromDateTime <= endDate);

                }

                if (alertRule != 0)
                {
                    query = query.Where(e => e.AlertRuleId == alertRule);

                }
                int[] buildingList = dbContext.Buildings.Where(x => x.SiteId == siteId)
                            .Select(e => e.Id)
                            .Distinct()
                            .ToArray();

                if(blockId == 0)
                    query = query.Where(e => buildingList.Contains(e.BuildingFkId));
                else
                {
                    query = query.Where(e => e.BuildingFkId == blockId);
                }

                if (queryString.ContainsKey("FMCCStatus"))
                {
                    if (!string.IsNullOrEmpty(queryString["FMCCStatus"]))
                    {
                        int status = int.Parse(queryString["FMCCStatus"]);
                        query = query.Where(e => e.FMCCStatus == status);
                    }
                }

                var queryLoad = query.Select(e => new
                {
                    Id = e.Id,
                    FromDate = e.FromDateTime,
                    ToDate = e.ToDateTime,
                    Block = e.BuildingId,
                    Saverity = e.Severity,
                    CurrentValue = e.AlertValue,
                    ReferenceValue = e.ReferenceValue,
                    LastRecored = e.LastRecord,
                    Condition = e.AlertCondition,
                    FMCCStatus = e.FMCCStatus,
                    Type = e.Type
                }).OrderByDescending(x=>x.FromDate).Skip(start).Take(length).ToList();

                var recordsTotal = query.Count();
                var recordsFiltered = query.Count();

                var filteredData = queryLoad.Select(e => new
                {
                    Id = e.Id,
                    FromDate = e.FromDate,
                    ToDate = e.ToDate,
                    Block = e.Block,
                    Saverity = e.Saverity,
                    CurrentValue = e.CurrentValue,
                    ReferenceValue = e.ReferenceValue,
                    LastRecored = e.LastRecored,
                    Condition = e.Condition,
                    Type = e.Type,
                    FMCCStatus = e.FMCCStatus
                }).ToList();

                var result = this.Json(new
                {
                    draw= Convert.ToInt32(queryString["draw"]),
                    recordsFiltered = recordsFiltered,
                    data = filteredData,
                    recordsTotal= recordsTotal
                });
                return result;
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return new List<int>();
            }

        }

        [HttpGet]
        [Route("api/alert/readallRuleForCombo")]
        public Output GetAllAlertRuleSetupList()
        {
            Output output = new Output();
            try
            {
                output.model = dbContext.AlertRuleSetups.Select(e => new { id = e.Id, text = e.AlertText }).Distinct().ToList();
                output.okay = true;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }
        

        /// <summary>
        /// Set alert undefined
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/alert/setundefined")]
        public object SetUndefined(Alarm model)
        {
            Output result = new Output();
            try
            {
                if (model != null)
                {
                    if (model.Id > 0)
                    {
                        var alert = dbContext.Alerts.Find(model.Id);
                        if (alert != null)
                        {
                            alert.FMCCStatus = 1;
                            dbContext.SaveChanges();
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
        /// <summary>
        /// Set alert acknowledged
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/alert/setacknowledged")]
        public object SetAcknowledged(Alarm model)
        {
            Output result = new Output();
            try
            {
                if (model != null)
                {
                    if (model.Id > 0)
                    {
                        var alarm = dbContext.Alerts.Find(model.Id);
                        if (alarm != null)
                        {
                            alarm.FMCCStatus = 2;
                            dbContext.SaveChanges();
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
        /// <summary>
        /// Set alert average window's minute
        /// </summary>
        /// <param name="model">Average model contains minute</param>
        /// <returns></returns>
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/alertaverage/update")]
        public Output SetAlertAverageMinute(AlertAverageSetupModel model)
        {
            Output output = new Output();
            try
            {
                if (model != null)
                {
                    if (model.Minute > 0)
                    {
                        AlertAverageSetup alertAverageSetup = dbContext.AlertAverageSetups.Where(x => x.BuildingFkId == model.BuildingFkId).FirstOrDefault();
                        if (alertAverageSetup == null)
                        {
                            var dbmodel = new AlertAverageSetup();


                            dbmodel.DateTime = DateTime.Now;
                            dbmodel.Minute = model.Minute;
                            dbmodel.BuildingFkId = model.BuildingFkId;
                            dbmodel.BuildingId = model.BuildingId;
                            dbContext.AlertAverageSetups.Add(dbmodel);
                            dbContext.SaveChanges();
                            output.okay = true;
                            output.message = "Data Saved Successfully.";
                            output.model = dbmodel;
                        }
                        else
                        {
                            alertAverageSetup.DateTime = DateTime.Now;
                            alertAverageSetup.Minute = model.Minute;
                            dbContext.AlertAverageSetups.AddOrUpdate(alertAverageSetup);
                            dbContext.SaveChanges();
                            output.okay = true;
                            output.message = "Data Saved Successfully.";
                            output.model = null;
                        }


                    }
                    else
                    {
                        output.okay = false;
                        output.model = null;
                        output.message = "Invalid Model.";
                    }

                }
                else
                {
                    output.okay = false;
                    output.model = null;
                    output.message = "Not specified.";
                }
            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/alertaverage/export")]
        public HttpResponseMessage Export(JObject model)
        {
            Output output = new Output();
            try
            {

                if (model != null)
                {
                    {
                        StringWriter sw = new StringWriter();

                        sw.WriteLine("\"Block\",\"Object\",\"DataField\",\"Value\",\"TimeStamp\"");
                        int buildingId = Convert.ToInt32(model.GetValue("blk").ToString());
                        int objectId = Convert.ToInt32(model.GetValue("obj").ToString());
                        int datafieldId = Convert.ToInt32(model.GetValue("df").ToString());
                        DateTime startDate = Convert.ToDateTime(model.GetValue("fd").ToString());
                        DateTime endDate = Convert.ToDateTime(model.GetValue("td").ToString());
                        List<TempReading> tempReadings =
                            dbContext.TempReadings.Where(x => x.BuildingFkId == buildingId && x.ObjectFkId == objectId && x.DataFieldFkId == datafieldId && (x.Timestamp >= startDate && x.Timestamp <= endDate)).ToList();

                        foreach (var tempReading in tempReadings)
                        {
                            sw.WriteLine(string.Format("\"{0}\",\"{1}\",\"{2}\",\"{3}\",\"{4}\"",

                            tempReading.BuildingId,
                            tempReading.ObjectId,
                            tempReading.DataFieldId,
                            tempReading.Value,
                            tempReading.Timestamp
                            ));
                        }
                        HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.OK);
                        message.Content = new StringContent(sw.ToString());
                        message.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                        message.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                        message.Content.Headers.ContentDisposition.FileName = DateTime.Now.ToShortDateString() + DateTime.Now.ToLongTimeString() + ".csv";

                        return message;

                    }
                }
                else
                {
                    output.okay = false;
                    output.model = null;
                    output.message = "Not specified.";
                }
            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return null;
        }

        /// <summary>
        /// Get Alert Average Data
        /// </summary>
        /// <returns>Output object contain model, response and other things</returns>
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/alertaverage/getalertaverage")]
        public Output GetAlertAverageMinute()
        {
            Output output = new Output();
            try
            {
                var alertAverageSetupList = dbContext.AlertAverageSetups.ToList();

                output.okay = true;
                output.message = "Data Saved Successfully.";
                output.model = (alertAverageSetupList == null && alertAverageSetupList.Count == 0) ? new List<AlertAverageSetup>() : alertAverageSetupList;

            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
                logger.Error(output.message);
            }
            return output;
        }

        /// <summary>
        /// Convert datetime with value and format
        /// </summary>
        /// <param name="value"></param>
        /// <param name="format"></param>
        /// <returns></returns>
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

        /// <summary>
        /// A web api methods which process alert data based on tempreading and alert rule
        /// </summary>
        /// <returns>true if all alert processed, false if not</returns>
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/AlertData/AlertTotalComsuptionProcessing")]
        public bool AlertTotalComsuptionProcessing()
        {

            // return true;
            using (var db = new FMCCDataContext())
            {
                alerts = new List<Alert>();
                readingUpdates = new List<ReadingUpdate>();

                var buildings = db.Buildings.Where(x => x.IsActive == true).ToList();

                foreach (var building in buildings)
                {
                    int buildingFkId = building.Id;
                    var alertRuleList = db.AlertRuleSetups.Where(x => x.BuildingFkId == building.Id).ToList();
                    try
                    {
                        foreach (var alertRule in alertRuleList)
                        {
                            if (alertRule.StartDate == null || alertRule.EndDate == null || alertRule.WeekDays == null)
                                continue;

                            if (!alertRule.WeekDays.Contains(DateTime.Now.AddDays(-1).ToString("ddd").ToLower()))
                                continue;

                            //power comsumption
                            if (alertRule.Type == (int)AllEnums.ReportType.TotalPowerConsumption)
                            {
                                var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == "OverallPowerConsumption").UnitName;//"kw";

                                var powerConsumpDataFieldId =
                db.BuildingObjectDatas.Where(x => x.DataFieldUnit == unit && x.BuildingFkId == buildingFkId).ToList();
                                TotalConsumptionCalculator(db, buildingFkId, alertRule, powerConsumpDataFieldId, AllEnums.ObjectValues.TotalPowerConsumption, "Total Power Consumption");
                            }

                            if (alertRule.Type == (int)AllEnums.ReportType.TotalWaterConsumption)
                            {
                                var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == "OverallWaterConsumption").UnitName;
                                var waterConsumpDataFieldId = db.BuildingObjectDatas.Where(x => x.DataFieldUnit == unit && x.BuildingFkId == buildingFkId).ToList();

                                TotalConsumptionCalculator(db, buildingFkId, alertRule, waterConsumpDataFieldId, AllEnums.ObjectValues.TotalWaterConsumption, "Total Water Consumption");
                            }

                            if (alertRule.Type == (int)AllEnums.ReportType.AnyTemperaturePoint)
                            {
                                
                                string unit = null;
                                var objectUnitMapping = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == "Temperature");
                                if (objectUnitMapping !=
                                    null)
                                {
                                    unit = objectUnitMapping.UnitName;
                                }
                                else
                                {
                                    unit = "c";
                                }
                                var anyTempDataFieldId = new List<int>();
                                if (string.IsNullOrEmpty(alertRule.SelectedDataIds))
                                {
                                    anyTempDataFieldId =
                                        db.BuildingObjectDatas.Where(
                                            x => x.DataFieldUnit == unit && x.BuildingFkId == buildingFkId)
                                            .Select(x => x.DataFieldFkId)
                                            .ToList();

                                }
                                else
                                {
                                    var dfList = alertRule.SelectedDataIds.Split(',');

                                    foreach (var s in dfList)
                                    {
                                        if (!string.IsNullOrEmpty(s))
                                            anyTempDataFieldId.Add(Convert.ToInt32(s));

                                    }
                                }
                                
                                var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day - 1,
                          alertRule.StartDate.Value.Hour,
                          alertRule.StartDate.Value.Minute, alertRule.StartDate.Value.Second)

                                ;
                                var endDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day - 1,
                                    alertRule.EndDate.Value.Hour,
                                    alertRule.EndDate.Value.Minute, alertRule.EndDate.Value.Second);

                                var readings = GetTempReadingsValueForSinglePoints(db, buildingFkId, anyTempDataFieldId, startDate, endDate);

                                IterateReadingsAndCalculateAlert(readings, alertRule);
                            }
                        }
                    }
                    catch (System.Exception exception)
                    {
                        logger.Error(exception.Message);
                        return false;
                    }

                    SupressAndSaveAlert(db, building, alerts);
                    alerts = new List<Alert>();
                }
            }
            return true;
        }

        private void SupressAndSaveAlert(FMCCDataContext db, Building building, List<Alert> alertsforInsert)
        {
            var alertSuppressSlot = (from a in db.AlertSuppresses
                                     where a.BuildingFkId == building.Id
                                     orderby a.From_Date descending
                                     select new AlertSuppressSlot
                                     {
                                         TimeStart = a.From_Date,
                                         TimeEnd = a.to_Date
                                     }).ToList();

            var alertDataAfterSuppress = (from x in alertsforInsert
                                          where alertSuppressSlot.Any(a => a.TimeStart <= x.FromDateTime && a.TimeEnd >= x.ToDateTime)
                                          select x).ToList();

            foreach (var suppressedAlert in alertDataAfterSuppress)
            {
                var alert =
                    alertsforInsert.Where(
                        r =>
                            r.BuildingFkId == suppressedAlert.BuildingFkId && r.FromDateTime == suppressedAlert.FromDateTime &&
                            r.ToDateTime == suppressedAlert.ToDateTime).SingleOrDefault();
                alert.FMCCStatus = 3;
            }

            EFBatchOperation.For(db, db.Alerts).InsertAll(alertsforInsert);
        }

        private void TotalConsumptionCalculator(FMCCDataContext db, int buildingFkId, AlertRuleSetup alertRule, List<BuildingObjectData> consumptionDataFieldId, AllEnums.ObjectValues objectValue, string datafieldId,bool postProcess =false,DateTime? startDate=null,DateTime?endDate=null)
        {


            var objectFkIds = consumptionDataFieldId.Select(s => s.DataFieldFkId).Distinct();
            var readings = (postProcess==false)?GetTempReadingsValueForTotalConsumption(db, buildingFkId, objectFkIds, alertRule): GetTempReadingsValueForTotalConsumptionPost(db, buildingFkId, objectFkIds, alertRule,startDate.Value,endDate.Value);

            string alertCondition = null;
            int condition = 0;
            double referenceValue = 0;
            AlertRuleSetup setup = alertRule;
            double totalReadingValue =
                Convert.ToDouble(readings.Sum(a => a.Value));
            referenceValue = Convert.ToDouble(alertRule.ReferenceValue);


            condition = AlertRuleCalculation(referenceValue, alertRule, condition,
                totalReadingValue, ref alertCondition);

            if (condition == 1)
            {
                //save alert
                var alert = new Alert();
                // { AlertCondition = alertCondition, AlertValue = averageReadingValue, BuildingFkId = building.Id, FMCCStatus = 1, BuildingId = building.BuildingId });
                alert.AlertRuleId = alertRule.Id;
                alert.BuildingFkId = Convert.ToInt32(alertRule.BuildingFkId);
                alert.BuildingId = alertRule.BuildingId;
                alert.ObjetFkId = (int)objectValue; //Convert.ToInt32(alertRule.ObjectFkId);
                alert.ObjetId = objectValue.ToString();
                alert.DataFieldFkId = 0; //Convert.ToInt32(alertRule.DataFieldFkId);
                alert.DataFieldId = datafieldId; //alertRuleSetup.DataFieldId;
               
                alert.FromDateTime = (!(startDate.HasValue) || startDate==null )?new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day - 1,
                    alertRule.StartDate.Value.Hour,
                    alertRule.StartDate.Value.Minute, alertRule.StartDate.Value.Second)
                 :
                    alert.FromDateTime = new DateTime(startDate.Value.Year, startDate.Value.Month, startDate.Value.Day,
                    alertRule.StartDate.Value.Hour,
                    alertRule.StartDate.Value.Minute, alertRule.StartDate.Value.Second)
                    ;
                alert.ToDateTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day - 1,
                    alertRule.EndDate.Value.Hour,
                    alertRule.EndDate.Value.Minute, alertRule.EndDate.Value.Second);
                alert.Severity = alertRule.Severity == 1 ? "Minor" : alertRule.Severity == 2 ? "Major" : "Critical";
                alert.AlertValue = totalReadingValue;
                alert.ReferenceValue = referenceValue;
                alert.AlertCondition = alertCondition;
                alert.AnyTemperatureCondition = alertCondition.Contains("below") ? (int)AllEnums.AlertCondition.Below : (int)AllEnums.AlertCondition.Above;
                alert.Type = alertRule.Type;
                alert.FMCCStatus = 1;
                alert.IsSMS = false;
                alert.IsEmail = false;
                alert.IsActive = true;
                alert.LastRecord = "0";
                alerts.Add(alert);
            }
        }

        private static List<TempReading> GetTempReadingsValueForTotalConsumption(FMCCDataContext db, int buildingFkId, IEnumerable<int> objectFkIds,
            AlertRuleSetup alertRule)
        {
            List<TempReading> readings = (from b in db.Buildings
                                          join r in db.TempReadings
                                              on b.Id equals r.BuildingFkId
                                          where r.BuildingFkId == buildingFkId
                                                && objectFkIds.Contains(r.DataFieldFkId)
                                                &&
                                                DbFunctions.CreateDateTime(r.Timestamp.Year, r.Timestamp.Month, r.Timestamp.Day, r.Timestamp.Hour,
                                                    r.Timestamp.Minute, r.Timestamp.Second)
                                                >=
                                                DbFunctions.CreateDateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day - 1,
                                                    alertRule.StartDate.Value.Hour,
                                                    alertRule.StartDate.Value.Minute, alertRule.StartDate.Value.Second)
                                                &&
                                                DbFunctions.CreateDateTime(r.Timestamp.Year, r.Timestamp.Month, r.Timestamp.Day, r.Timestamp.Hour,
                                                    r.Timestamp.Minute, r.Timestamp.Second)
                                                <=
                                                DbFunctions.CreateDateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day - 1,
                                                    alertRule.EndDate.Value.Hour,
                                                    alertRule.EndDate.Value.Minute, alertRule.EndDate.Value.Second)
                                          select r).AsNoTracking().OrderBy(x => x.Timestamp).ToList();
            return readings;
        }

        private static List<TempReading> GetTempReadingsValueForTotalConsumptionPost(FMCCDataContext db, int buildingFkId, IEnumerable<int> objectFkIds,
            AlertRuleSetup alertRule,DateTime startDate,DateTime endDate)
        {
            List<TempReading> readings = (from b in db.Buildings
                                          join r in db.TempReadings
                                              on b.Id equals r.BuildingFkId
                                          where r.BuildingFkId == buildingFkId
                                                && objectFkIds.Contains(r.DataFieldFkId)
                                                &&
                                                DbFunctions.CreateDateTime(r.Timestamp.Year, r.Timestamp.Month, r.Timestamp.Day, r.Timestamp.Hour,
                                                    r.Timestamp.Minute, r.Timestamp.Second)
                                                >=
                                                DbFunctions.CreateDateTime(startDate.Year, startDate.Month, startDate.Day,
                                                    startDate.Hour,
                                                    startDate.Minute, startDate.Second)
                                                &&
                                                DbFunctions.CreateDateTime(r.Timestamp.Year, r.Timestamp.Month, r.Timestamp.Day, r.Timestamp.Hour,
                                                    r.Timestamp.Minute, r.Timestamp.Second)
                                                <=
                                                DbFunctions.CreateDateTime(endDate.Year, endDate.Month, endDate.Day,
                                                    endDate.Hour,
                                                    endDate.Minute, endDate.Second)
                                          select r).AsNoTracking().OrderBy(x => x.Timestamp).ToList();
            return readings;
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/AlertData/AlertSinglePointProcessing")]
        public bool AlertSinglePointProcessing()
        {
            DateTime schedulerStartTime = DateTime.Now;
            // return true;
            using (var db = new FMCCDataContext())
            {
                singlePointAlerts = new List<Alert>();

                var buildings = db.Buildings.Where(x => x.IsActive == true).ToList();

                foreach (var building in buildings)
                {
                    int buildingFkId = building.Id;
                    var alertRuleList = db.AlertRuleSetups.Where(x => x.BuildingFkId == building.Id).ToList();
                    try
                    {
                        foreach (var alertRule in alertRuleList)
                        {
                            if (alertRule.StartDate == null || alertRule.EndDate == null || alertRule.WeekDays == null)
                                continue;

                            if (!alertRule.WeekDays.Contains(DateTime.Now.ToString("ddd").ToLower()))
                                continue;

                            var startDate = (schedulerStartTime.TimeOfDay > alertRule.StartDate.Value.TimeOfDay) ? schedulerStartTime : alertRule.StartDate.Value;
                            var endDate = (schedulerStartTime.AddHours(1).TimeOfDay < alertRule.EndDate.Value.TimeOfDay) ? schedulerStartTime.AddHours(1) : alertRule.EndDate.Value;



                            if (alertRule.Type == (int)AllEnums.ReportType.SinglePoint)
                            {
                                var list = db.BuildingObjectDatas.Where(x => x.BuildingFkId == buildingFkId && x.ObjectFkId == alertRule.ObjectFkId && x.DataFieldFkId == alertRule.DataFieldFkId).ToList();
                                List<int> objectFkIds = new List<int>();

                                objectFkIds.Add(alertRule.DataFieldFkId.Value);
                                var readings = GetTempReadingsValueForSinglePoints(db, buildingFkId, objectFkIds, startDate, endDate);

                                IterateReadingsAndCalculateAlert(readings, alertRule);
                            }

                            if (alertRule.Type == (int)AllEnums.ReportType.AnyEquipment)
                            {
                                var onOffDataFields = db.ObjectOnOffMappings.ToList();
                                List<int> objectFkIds = new List<int>();
                                //foreach (var objectOnOffMapping in onOffDataFields)
                                {
                                    objectFkIds.Add(alertRule.DataFieldFkId.Value);
                                }
                                var readings = GetTempReadingsValueForSinglePoints(db, buildingFkId, objectFkIds, startDate, endDate);

                                IterateReadingsAndCalculateAlert(readings, alertRule);
                            }


                        }
                    }
                    catch (System.Exception exception)
                    {
                        logger.Error(exception.Message);
                        return false;
                    }

                    SupressAndSaveAlert(db, building, singlePointAlerts);
                    singlePointAlerts = new List<Alert>();

                }
            }
            return true;
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/AlertData/PostAlert")]
        public bool PostAlertProcessing(AlertProcessingInput input)
        {
            int alertRuleId = input.AlertRuleId;
            DateTime startDate = input.StartDateTime;
            DateTime endDate = input.EndDateTime;

            DateTime schedulerStartTime = DateTime.Now;
            // return true;
            using (var db = new FMCCDataContext())
            {
                var alertRule = db.AlertRuleSetups.FirstOrDefault(x => x.Id == alertRuleId);

                db.Alerts.RemoveRange(db.Alerts.Where(x => x.AlertRuleId == alertRule.Id && x.FromDateTime >= startDate && x.FromDateTime <= endDate));
                db.SaveChanges();
                if (alertRule == null) return false;
                singlePointAlerts = new List<Alert>();
                alerts = new List<Alert>();

                var building = db.Buildings.Where(x => x.Id == alertRule.BuildingFkId).FirstOrDefault();


                int buildingFkId = building.Id;
                try
                {

                    if (alertRule.StartDate == null || alertRule.EndDate == null || alertRule.WeekDays == null)
                        return false;

                    startDate = new DateTime(startDate.Year,startDate.Month,startDate.Day,alertRule.StartDate.Value.Hour, alertRule.StartDate.Value.Minute, alertRule.StartDate.Value.Second);
                    endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, alertRule.EndDate.Value.Hour, alertRule.EndDate.Value.Minute, alertRule.EndDate.Value.Second);
                    while (startDate < endDate)
                    {
                        if (!alertRule.WeekDays.Contains(startDate.ToString("ddd").ToLower()))
                        {
                            startDate = startDate.AddDays(1);
                            continue;
                        }
                        
                        if (alertRule.Type == (int)AllEnums.ReportType.SinglePoint)
                        {
                            var list = db.BuildingObjectDatas.Where(x => x.BuildingFkId == buildingFkId && x.ObjectFkId == alertRule.ObjectFkId && x.DataFieldFkId == alertRule.DataFieldFkId).ToList();
                            List<int> objectFkIds = new List<int>();

                            objectFkIds.Add(alertRule.DataFieldFkId.Value);
                            var readings = GetTempReadingsValueForSinglePoints(db, buildingFkId, objectFkIds, startDate, startDate.AddDays(1)>endDate?endDate:startDate.AddDays(1));

                            IterateReadingsAndCalculateAlert(readings, alertRule);
                        }

                        if (alertRule.Type == (int)AllEnums.ReportType.AnyEquipment)
                        {
                            var onOffDataFields = db.ObjectOnOffMappings.ToList();
                            List<int> objectFkIds = new List<int>();
                            objectFkIds.Add(alertRule.DataFieldFkId.Value);

                            var readings = GetTempReadingsValueForSinglePoints(db, buildingFkId, objectFkIds, startDate, startDate.AddDays(1) > endDate ? endDate : startDate.AddDays(1));

                            IterateReadingsAndCalculateAlert(readings, alertRule);
                        }

                        if (alertRule.Type == (int)AllEnums.ReportType.TotalPowerConsumption)
                        {
                            var unit = db.ObjectUnitMappings.FirstOrDefault(x=>x.ObjectDataField == "OverallPowerConsumption").UnitName;//"kw";
                            var powerConsumpDataFieldId =
            db.BuildingObjectDatas.Where(x => x.DataFieldUnit == unit && x.BuildingFkId == buildingFkId).ToList();
                            TotalConsumptionCalculator(db, buildingFkId, alertRule, powerConsumpDataFieldId, AllEnums.ObjectValues.TotalPowerConsumption, "Total Power Consumption",true,startDate, startDate.AddDays(1) > endDate ? endDate : startDate.AddDays(1));
                        }

                        if (alertRule.Type == (int)AllEnums.ReportType.TotalWaterConsumption)
                        {
                            var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == "OverallWaterConsumption").UnitName; ;
                            var waterConsumpDataFieldId = db.BuildingObjectDatas.Where(x => x.DataFieldUnit == unit && x.BuildingFkId == buildingFkId).ToList();

                            TotalConsumptionCalculator(db, buildingFkId, alertRule, waterConsumpDataFieldId, AllEnums.ObjectValues.TotalWaterConsumption, "Total Water Consumption", true, startDate, startDate.AddDays(1) > endDate ? endDate : startDate.AddDays(1));
                        }

                        if (alertRule.Type == (int)AllEnums.ReportType.AnyTemperaturePoint)
                        {
                            string unit = null;
                            var objectUnitMapping = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == "Temperature");
                            if (objectUnitMapping !=
                                null)
                            {
                                unit = objectUnitMapping.UnitName;
                            }
                            else
                            {
                                unit = "c";
                            }
                            var anyTempDataFieldId = new List<int>();
                            if (string.IsNullOrEmpty(alertRule.SelectedDataIds))
                            {
                                anyTempDataFieldId =
                                    db.BuildingObjectDatas.Where(
                                        x => x.DataFieldUnit == unit && x.BuildingFkId == buildingFkId)
                                        .Select(x => x.DataFieldFkId)
                                        .ToList();

                            }
                            else
                            {
                                var dfList = alertRule.SelectedDataIds.Split(',');

                                foreach (var s in dfList)
                                {
                                    if (!string.IsNullOrEmpty(s))
                                        anyTempDataFieldId.Add(Convert.ToInt32(s));

                                }
                            }


                            var readings = GetTempReadingsValueForSinglePoints(db, buildingFkId, anyTempDataFieldId, startDate, startDate.AddDays(1) > endDate ? endDate : startDate.AddDays(1));

                            IterateReadingsAndCalculateAlert(readings, alertRule);
                        }



                        startDate = startDate.AddDays(1);
                    }



                }
                catch (System.Exception exception)
                {
                    logger.Error(exception.Message);
                    return false;
                }

                SupressAndSaveAlert(db, building, singlePointAlerts);
                singlePointAlerts = new List<Alert>();
                SupressAndSaveAlert(db, building, alerts);
                alerts = new List<Alert>();

            }
            return true;
        }

        private void IterateReadingsAndCalculateAlert(List<TempReading> readings, AlertRuleSetup alertRule)
        {
            foreach (var reading in readings)
            {
                string alertCondition = null;
                int condition = 0;
                double referenceValue = 0;
                AlertRuleSetup setup = alertRule;
                double readingValue = reading.Value;
                referenceValue = Convert.ToDouble(alertRule.ReferenceValue);


                condition = AlertRuleCalculation(referenceValue, alertRule, condition,
                    readingValue, ref alertCondition);

                if (condition == 1)
                {
                    //save alert
                    var alert = new Alert();
                    // { AlertCondition = alertCondition, AlertValue = averageReadingValue, BuildingFkId = building.Id, FMCCStatus = 1, BuildingId = building.BuildingId });
                    alert.AlertRuleId = alertRule.Id;
                    alert.BuildingFkId = Convert.ToInt32(alertRule.BuildingFkId);
                    alert.BuildingId = alertRule.BuildingId;
                    alert.ObjetFkId = reading.ObjectFkId;
                    alert.ObjetId = reading.ObjectId;
                    alert.DataFieldFkId = reading.DataFieldFkId;
                    alert.DataFieldId = reading.DataFieldId;
                    alert.FromDateTime = reading.Timestamp
                        ;
                    alert.ToDateTime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day - 1,
                        alertRule.EndDate.Value.Hour,
                        alertRule.EndDate.Value.Minute, alertRule.EndDate.Value.Second);
                    alert.Severity = alertRule.Severity == 1 ? "Minor" : alertRule.Severity == 2 ? "Major" : "Critical";
                    alert.AlertValue = readingValue;
                    alert.ReferenceValue = referenceValue;
                    alert.AlertCondition = alertCondition;
                    alert.AnyTemperatureCondition = alertCondition.Contains("below") ? (int)AllEnums.AlertCondition.Below : (int)AllEnums.AlertCondition.Above;
                    alert.FMCCStatus = 1;
                    alert.IsSMS = false;
                    alert.IsEmail = false;
                    alert.IsActive = true;
                    alert.LastRecord = "0";
                    alert.Type = alertRule.Type;
                    singlePointAlerts.Add(alert);
                    //update status
                }
            }
        }

        private void AnyTemperatureAlertProcessing(FMCCDataContext db, int buildingFkId, IEnumerable<int> objectFkIds,
            DateTime startDate, DateTime endDate, AlertRuleSetup alertRule)
        {
            //if (alertRule.Type == (int)AllEnums.ReportType.AnyTemperaturePoint)
            //{
            //    var powerConsumpDataFieldId = db.BuildingObjectDatas.Where(x => x.DataFieldUnit == "c" && x.BuildingFkId == buildingFkId).ToList();
            //    var objectFkIds = powerConsumpDataFieldId.Select(s => s.ObjectFkId).Distinct();
            //    var readings = GetTempReadingsValueForSinglePoints(db, buildingFkId, objectFkIds, startDate, endDate);

            //    IterateReadingsAndCalculateAlert(readings, alertRule);
            //}
            var t = (from u in db.TempReadings
                     where
                       DbFunctions.CreateDateTime(u.Timestamp.Year, u.Timestamp.Month, u.Timestamp.Day, u.Timestamp.Hour,
                                                    u.Timestamp.Minute, u.Timestamp.Second)
                                                >=
                                                DbFunctions.CreateDateTime(startDate.Year, startDate.Month, startDate.Day, startDate.Hour,
                                                    startDate.Minute, startDate.Second)
                                                &&
                                                DbFunctions.CreateDateTime(u.Timestamp.Year, u.Timestamp.Month, u.Timestamp.Day, u.Timestamp.Hour,
                                                    u.Timestamp.Minute, u.Timestamp.Second)
                                                <=
                                                DbFunctions.CreateDateTime(endDate.Year, endDate.Month, endDate.Day, endDate.Hour,
                                                    endDate.Minute, endDate.Second)
                                                    && u.BuildingFkId == buildingFkId
                                                    && objectFkIds.Contains(u.DataFieldFkId)

                     let range = (u.Value >= alertRule.ReferenceValue ? "Above" : "Below")
                     let dataField = u.DataFieldFkId
                     group u by new { range, dataField } into g
                     select new { g.Key.dataField, g.Key.range, Count = g.Count() }).GroupBy(l => l.dataField).ToList();


            List<Alert> anyTempAlert = new List<Alert>();
            foreach (var item in objectFkIds)
            {
                var below = t.SingleOrDefault(l => l.Key == item);
                int belowCount = below.Where(l => l.range == "Below").Select(l => l.Count).FirstOrDefault();
                int aboveCount = below.Where(l => l.range == "Above").Select(l => l.Count).FirstOrDefault();

                int grandTotal = belowCount + aboveCount;
                int computedPercentage = 0;

                computedPercentage = (belowCount / grandTotal) * 100;

                if (computedPercentage > alertRule.Percentage.Value)
                {
                    var alert = new Alert();
                    // { AlertCondition = alertCondition, AlertValue = averageReadingValue, BuildingFkId = building.Id, FMCCStatus = 1, BuildingId = building.BuildingId });
                    alert.AlertRuleId = alertRule.Id;
                    alert.BuildingFkId = Convert.ToInt32(alertRule.BuildingFkId);
                    alert.BuildingId = alertRule.BuildingId;
                    alert.DataFieldFkId = item;
                    alert.DataFieldId = db.BuildingObjectDatas.Where(x => x.ObjectFkId == item).FirstOrDefault().DataFieldId;
                    alert.FromDateTime = startDate;
                    alert.ToDateTime = endDate;
                    alert.Severity = alertRule.Severity == 1 ? "Minor" : alertRule.Severity == 2 ? "Major" : "Critical";
                    alert.AlertValue = belowCount;
                    alert.ReferenceValue = alertRule.ReferenceValue.Value;
                    alert.AlertCondition = null;
                    alert.AnyTemperatureCondition = (int)AllEnums.AlertCondition.Below;
                    alert.FMCCStatus = 1;
                    alert.IsSMS = false;
                    alert.IsEmail = false;
                    alert.IsActive = true;
                    alert.LastRecord = "0";
                    alert.Type = (int)alertRule.Type;
                    anyTempAlert.Add(alert);
                }
            }

            SupressAndSaveAlert(db, db.Buildings.SingleOrDefault(x => x.Id == buildingFkId), anyTempAlert);
            anyTempAlert = new List<Alert>();
        }
        private static List<TempReading> GetTempReadingsValueForSinglePoints(FMCCDataContext db, int buildingFkId, List<int> objectFkIds,
            DateTime startDate, DateTime endDate)
        {
            List<TempReading> readings = (from b in db.Buildings
                                          join r in db.TempReadings
                                              on b.Id equals r.BuildingFkId
                                          where r.BuildingFkId == buildingFkId
                                                && objectFkIds.Contains(r.DataFieldFkId)
                                                &&
                                                DbFunctions.CreateDateTime(r.Timestamp.Year, r.Timestamp.Month, r.Timestamp.Day, r.Timestamp.Hour,
                                                    r.Timestamp.Minute, r.Timestamp.Second)
                                                >=
                                                DbFunctions.CreateDateTime(startDate.Year, startDate.Month, startDate.Day, startDate.Hour,
                                                    startDate.Minute, startDate.Second)
                                                &&
                                                DbFunctions.CreateDateTime(r.Timestamp.Year, r.Timestamp.Month, r.Timestamp.Day, r.Timestamp.Hour,
                                                    r.Timestamp.Minute, r.Timestamp.Second)
                                                <=
                                                DbFunctions.CreateDateTime(endDate.Year, endDate.Month, endDate.Day, endDate.Hour,
                                                    endDate.Minute, endDate.Second)
                                          select r).AsNoTracking().OrderBy(x => x.Timestamp).ToList();
            return readings;
        }


        /// <summary>
        /// calculate alert with reference, alert rule, condition and averaging value
        /// </summary>
        /// <param name="referenceValue"></param>
        /// <param name="alertRuleSetup"></param>
        /// <param name="condition"></param>
        /// <param name="averageReadingValue"></param>
        /// <param name="alertCondition"> for sending the matched condition</param>
        /// <returns></returns>
        private int AlertRuleCalculation(double referenceValue, AlertRuleSetup alertRuleSetup, int condition,
            double averageReadingValue, ref string alertCondition)
        {
            double presentageValue = 0;//(referenceValue / 100) * Convert.ToDouble(alertRuleSetup.ThresholdValue);

            if (Convert.ToInt32(alertRuleSetup.Condition) == 1) // if condition above
            {
                var aboveValue = (referenceValue + presentageValue);

                condition = CheckAlertRule(averageReadingValue, aboveValue, 1);

                alertCondition = "Above than " + alertRuleSetup.ReferenceValue;
            }
            else if (Convert.ToInt32(alertRuleSetup.Condition) == 2) // if condition below
            {
                var belowValue = (referenceValue - presentageValue);
                condition = CheckAlertRule(averageReadingValue, belowValue, 2);

                alertCondition = "Below than " + alertRuleSetup.ReferenceValue;
            }
            else if (Convert.ToInt32(alertRuleSetup.Condition) == 3) // if condition deviation
            {
                var aboveDeviateValue = (referenceValue + presentageValue);
                condition = CheckAlertRule(averageReadingValue, aboveDeviateValue, 1);
                alertCondition = "Above than " + alertRuleSetup.ReferenceValue;

                if (condition == 0)
                {
                    var belowDeviateValue = (referenceValue - presentageValue);
                    condition = CheckAlertRule(averageReadingValue, belowDeviateValue, 2);
                    alertCondition = "Below than " + alertRuleSetup.ThresholdValue;
                }
            }
            return condition;
        }

        /// <summary>
        /// Store alert
        /// </summary>
        /// <param name="alertRuleSetup"></param>
        /// <param name="fromDateTime"></param>
        /// <param name="toDateTime"></param>
        /// <param name="alertValue"></param>
        /// <param name="referenceValue"></param>
        /// <param name="lastRecord"></param>
        /// <param name="alertCondition"></param>
        private void StoreAlert(AlertRuleSetup alertRuleSetup, DateTime fromDateTime, DateTime toDateTime, double alertValue,
            double referenceValue, string lastRecord, string alertCondition)
        {
            //   alerts = new List<BCSM.Models.Alert>();

            Alert existingAlert = alerts.FirstOrDefault(x => x.BuildingFkId == alertRuleSetup.BuildingFkId && x.ObjetFkId == alertRuleSetup.ObjectFkId
                                   && x.DataFieldFkId == alertRuleSetup.DataFieldFkId && x.FromDateTime == fromDateTime && x.ToDateTime == toDateTime);

            if (existingAlert == null)
            {
                var alert = new Alert();
                alert.AlertRuleId = alertRuleSetup.Id;
                alert.BuildingFkId = Convert.ToInt32(alertRuleSetup.BuildingFkId);
                alert.BuildingId = alertRuleSetup.BuildingId;
                alert.ObjetFkId = Convert.ToInt32(alertRuleSetup.ObjectFkId);
                alert.ObjetId = alertRuleSetup.ObjectId;
                alert.DataFieldFkId = Convert.ToInt32(alertRuleSetup.DataFieldFkId);
                alert.DataFieldId = alertRuleSetup.DataFieldId;
                alert.FromDateTime = fromDateTime;
                alert.ToDateTime = toDateTime;
                alert.Severity = alertRuleSetup.Severity == 1 ? "Minor" : alertRuleSetup.Severity == 2 ? "Major" : "Critical";
                alert.AlertValue = alertValue;
                alert.ReferenceValue = referenceValue;
                alert.LastRecord = lastRecord;
                alert.AlertCondition = alertCondition;
                alert.FMCCStatus = 1;
                alert.IsSMS = false;
                alert.IsEmail = false;
                alert.IsActive = true;
                alert.LastRecord = "0";
                alerts.Add(alert);

            }

            else
            {
                var severity = existingAlert.Severity == "Minor" ? 1 : existingAlert.Severity == "Major" ? 2 : 3;

                if (severity < alertRuleSetup.Severity)
                {
                    alerts.RemoveAll(x => x.BuildingFkId == alertRuleSetup.BuildingFkId && x.ObjetFkId == alertRuleSetup.ObjectFkId
                             && x.DataFieldFkId == alertRuleSetup.DataFieldFkId && x.FromDateTime == fromDateTime &&
                             x.ToDateTime == toDateTime);

                    var alert = new Alert();
                    alert.AlertRuleId = alertRuleSetup.Id;
                    alert.BuildingFkId = Convert.ToInt32(alertRuleSetup.BuildingFkId);
                    alert.BuildingId = alertRuleSetup.BuildingId;
                    alert.ObjetFkId = Convert.ToInt32(alertRuleSetup.ObjectFkId);
                    alert.ObjetId = alertRuleSetup.ObjectId;
                    alert.DataFieldFkId = Convert.ToInt32(alertRuleSetup.DataFieldFkId);
                    alert.DataFieldId = alertRuleSetup.DataFieldId;
                    alert.FromDateTime = fromDateTime;
                    alert.ToDateTime = toDateTime;
                    alert.Severity = alertRuleSetup.Severity == 1 ? "Minor" : alertRuleSetup.Severity == 2 ? "Major" : "Critical";
                    alert.AlertValue = alertValue;
                    alert.ReferenceValue = referenceValue;
                    alert.LastRecord = lastRecord;
                    alert.AlertCondition = alertCondition;
                    alert.FMCCStatus = 1;
                    alert.IsSMS = false;
                    alert.IsEmail = false;
                    alert.IsActive = true;
                    alert.LastRecord = "0";
                    alerts.Add(alert);
                }
            }

        }
        /// <summary>
        /// check wherether alert rule value matches with condition
        /// </summary>
        /// <param name="valuePercentage"></param>
        /// <param name="alertRoleValuePercentage"></param>
        /// <param name="condition"></param>
        /// <returns>1 if value matched 0 if not</returns>
        private int CheckAlertRule(double valuePercentage, double alertRoleValuePercentage, int condition)
        {
            try
            {
                // condition list is : 1=Above, 2=Below, 3=Deviation

                switch (condition)
                {
                    case 1:
                        if (valuePercentage > alertRoleValuePercentage)
                        {
                            return 1;
                        }
                        return 0;
                    case 2:
                        if (valuePercentage < alertRoleValuePercentage)
                        {
                            return 1;
                        }
                        return 0;
                }
                return 0;
            }
            catch
            {
                return 0;
            }
        }

        /// <summary>
        /// A Web apimethods that sends mail if any alert occurs
        /// </summary>
        /// <returns>
        /// true if all alert email sent
        /// </returns>
        [System.Web.Http.Route("api/AlertData/MailProcessing")]
        [System.Web.Http.HttpGet]
        public bool MailProcessing()
        {
            try
            {
                List<AlertEmailRawModel> alertList;

                DateTime fromDateTime = new DateTime();
                DateTime toDateTime = new DateTime(); ;

                using (var db = new FMCCDataContext())
                {
                    // get date range
                    if (db.Alerts.Any(x => x.IsEmail == false))
                    {
                        fromDateTime = db.Alerts.Where(x => x.IsEmail == false).Min(x => x.FromDateTime);
                        toDateTime = db.Alerts.Where(x => x.IsEmail == false).Max(x => x.ToDateTime);
                    }

                    // took all alert row with user info based on email sent false
                    alertList = (from a in db.Alerts
                                 join ars in db.AlertRuleSetups on a.AlertRuleId equals ars.Id
                                 join nu in db.AlertNotifyUsers on ars.Id equals nu.AlertRuleSetupId
                                 join u in db.Users on nu.UserId equals u.Id
                                 join bl in db.Buildings on a.BuildingFkId equals bl.Id
                                 join ob in db.Objects on a.ObjetFkId equals ob.Id
                                 join df in db.DataFields on a.DataFieldFkId equals df.Id
                                 where a.IsEmail == false && a.FMCCStatus != 3
                                 orderby bl.Name, a.FromDateTime, ob.Name, df.Name
                                 select new AlertEmailRawModel
                                 {
                                     UserId = u.Id,
                                     FullName = u.FullName,
                                     Email = u.Email,
                                     Severity = a.Severity,
                                     BuildingName = bl.Name,
                                     AlertText = ars.AlertText,
                                     ObjectName = ob.Name,
                                     DatafieldName = df.Name,
                                     LastRecord = a.LastRecord,
                                     CurrentValue = a.AlertValue,
                                     ReferenceValue = a.ReferenceValue,
                                     FromDate = a.FromDateTime,
                                     ToDate = a.ToDateTime,
                                     Rule = a.AlertCondition,
                                 }).ToList();

                }

                if (alertList.Count > 0)
                {
                    IEnumerable<AlertMailDataModel> alertDataModel = (from r in alertList
                                                                      group r by new
                                                                      {
                                                                          r.Email,
                                                                          r.FullName,
                                                                      }
                                                                      into g
                                                                      select new AlertMailDataModel
                                                                      {
                                                                          Email = g.Key.Email,
                                                                          FullName = g.Key.FullName,
                                                                          Alerts = (from gg in g
                                                                                    orderby gg.FromDate
                                                                                    select new AlertMailDescription
                                                                                    {
                                                                                        BuildingName = gg.BuildingName,
                                                                                        TimeStart = gg.FromDate,
                                                                                        TimeEnd = gg.ToDate,
                                                                                        Severity = gg.Severity,
                                                                                        AlertText = gg.AlertText,
                                                                                        DataPoint = gg.ObjectName + " " + gg.DatafieldName,
                                                                                        LastRecord = gg.LastRecord,
                                                                                        CurrentValue = gg.CurrentValue,
                                                                                        ReferenceValue = gg.ReferenceValue,
                                                                                        Rule = gg.Rule
                                                                                    }).OrderBy(o => o.BuildingName).ThenBy(o => o.DataPoint).ThenBy(o => o.TimeStart).ToList()

                                                                      });

                    var alertDataModels = alertDataModel as AlertMailDataModel[] ?? alertDataModel.ToArray();

                    if (alertDataModels.Any())
                    {

                        foreach (var alertData in alertDataModels)
                        {

                            string filename = System.Web.HttpContext.Current.Server.MapPath("/templates/mailstructure.html");
                            string mailbody = System.IO.File.ReadAllText(filename);

                            var mbody = new StringBuilder();

                            int sl = 1;
                            var alertDescription = alertData.Alerts.FirstOrDefault();
                            if (alertDescription != null)
                            {
                                mbody.Append("<div>Dear " + alertData.FullName + ",</div><br />");
                                mbody.Append("<div>Following is the Alert recorded for " + alertDescription.TimeStart.ToString("dd-MM-yyyy") + ".</div><br />");

                            }

                            foreach (var item in alertData.Alerts)
                            {
                                mbody.Append(
                                            "<div>" +
                                            " <table> " +
                                            "<tr> <td>ITEM No:</td>    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td> <td>#" + sl + "</td> </tr>" +
                                            "<tr> <td>Block:</td>   <td>&nbsp;</td> <td> " + item.BuildingName + "</td> </tr>" +
                                            "<tr> <td>Alert Text:</td> <td>&nbsp;</td> <td> " + item.AlertText + " </td></tr>" +
                                            "<tr> <td>FROM DATE:</td>  <td>&nbsp;</td>  <td>" + item.TimeStart.ToString("dd-MM-yyyy hh:mm:ss tt") + "</td></tr>" +
                                            "<tr> <td>TO DATE:</td>    <td>&nbsp;</td>  <td>" + item.TimeEnd.ToString("dd-MM-yyyy hh:mm:ss tt") + "</td></tr>" +
                                            "<tr> <td>SEVERITY:</td>   <td>&nbsp;</td>   <td>" + item.Severity + "</td></tr>" +
                                            "<tr> <td>DATA POINT:</td>  <td>&nbsp;</td>  <td> " + item.DataPoint + "</td></tr>" +
                                            "<tr> <td>LAST RECORD:</td>  <td>&nbsp;</td> <td> " + item.LastRecord + " </td></tr>" +
                                            "<tr> <td>CURRENT VALUE:</td>  <td>&nbsp;</td> <td> " + item.CurrentValue.ToString("#.##") + " </td></tr>" +
                                            "<tr> <td>REFERENCE VALUE:</td> <td>&nbsp;</td> <td>" + item.ReferenceValue.ToString("#.##") + "</td> </tr>" +
                                            "<tr> <td>CONDITION:</td><td>&nbsp;</td> <td>" + item.Rule + "</td></tr><br />" +
                                            "</table>" +
                                            "</div>");
                                sl++;
                            }

                            mailbody = mailbody.Replace("##tbl##", mbody.ToString());

                            SendEmail(alertData.Email, mailbody);


                        }

                        using (var db = new FMCCDataContext())
                        {

                            EFBatchOperation.For(db, db.Alerts).Where(b => b.FromDateTime >= fromDateTime && b.ToDateTime <= toDateTime && b.IsEmail == false)
                           .Update(b => b.IsEmail, b => true);
                        }



                    }


                }

                return true;
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return false;
            }
        }
        /// <summary>
        /// Send Email
        /// </summary>
        /// <param name="toEmailAddress">recivers email address</param>
        /// <param name="mailbody">body of that email</param>
        /// <returns>true if mail sent successfully, false if failed to send</returns>
        private bool SendEmail(string toEmailAddress, string mailbody)
        {
            try
            {
                using (var message = new MailMessage("s3innovates@gmail.com", toEmailAddress))
                {
                    message.Subject = "Daily Alert Notification";
                    message.BodyEncoding = Encoding.UTF8;
                    message.IsBodyHtml = true;
                    message.Body = mailbody;
                    SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
                    System.Net.NetworkCredential basicCredential =
                        new System.Net.NetworkCredential("s3innovates@gmail.com", "123456789s3@s3innovate.com");
                    client.EnableSsl = true;
                    client.UseDefaultCredentials = true;
                    client.Credentials = basicCredential;
                    try
                    {
                        client.Send(message);
                        return true;
                    }
                    catch (Exception ex)
                    {
                        logger.Error(ex.Message);
                        return false;
                    }
                }
            }
            catch
            {
                return false;

            }
        }

    }

    #region alert processing model class
    public class AlertDataModel
    {
        public string BuildingName { get; set; }
        public List<AlertDescription> Alerts { get; set; }
        public List<string> Emails { get; set; }
    }
    public class AlertDescription
    {
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
        public string Severity { get; set; }
        public string DataPoint { get; set; }
        public string LastRecord { get; set; }
        public double ReferenceValue { get; set; }
        public string Rule { get; set; }
    }
    public class AlertOccurSlot
    {
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
    }
    public class AlertSuppressSlot
    {
        public DateTime? TimeStart { get; set; }
        public DateTime? TimeEnd { get; set; }
    }

    public class AlertMailDataModel
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public List<AlertMailDescription> Alerts { get; set; }
    }
    public class AlertMailDescription
    {
        public string BuildingName { get; set; }
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
        public string AlertText { get; set; }
        public string Severity { get; set; }
        public string DataPoint { get; set; }
        public string LastRecord { get; set; }
        public double CurrentValue { get; set; }
        public double ReferenceValue { get; set; }
        public string Rule { get; set; }
    }
    #endregion


}
