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
using System.Web.Http;
using System.Reflection;
using System.Data.Entity;
using EntityFramework.Utilities;
using System.Collections.Generic;
using Fmcc.Models.EntityDataModel;
using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Web;

namespace Fmcc.Controllers.ServiceControllers
{
    public class AlertController : ApiBaseController
    {
        private readonly ILog logger;
        private FMCCDataContext dbContext;
        private List<AlertData> alertDataList;

        public AlertController()
        {
            dbContext = new FMCCDataContext();
            alertDataList = new List<AlertData>();
            logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        }

        [HttpGet]
        [Route("api/getalertrulesetup")]
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
                    AlertNotifyUser = dbContext.AlertNotifyUsers.Where(s => s.AlertRuleSetupId == e.Id).Select(ee => ee.UserId.Value).ToList(),
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

        [HttpPost]
        [Route("api/postalertrulesetup")]
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
                            dbContext.AlertRuleSetups.Add(dbmodel);
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
                                            AlertRuleSetupId = dbmodel.Id,
                                            UserId = user.Id
                                        };
                                        dbContext.AlertNotifyUsers.Add(alertNotifyUser);
                                    }
                                }
                                dbContext.SaveChanges();
                            }
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

        [HttpPost]
        [Route("api/deletealertrulesetup")]
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

        [HttpGet]
        [Route("api/processalertdata")]
        public void ProcessAlertData()
        {
            try
            {
                //get a list of all active blocks. [Buildings represent the blocks of a Building]
                List<Building> blockList = dbContext.Buildings.Where(x => x.IsActive == true).ToList();

                foreach (var eachBlock in blockList)
                {
                    //find a list of all active AlertRuleSetup for current block context.
                    List<AlertRuleSetup> alertRuleSetupList = dbContext.AlertRuleSetups.Where(x => x.BuildingFkId == eachBlock.Id && x.IsActive == true).ToList();

                    if (alertRuleSetupList.Count > 0)
                    {
                        //find a list of all un-processed TempReading for current block context.
                        List<TempReading> readingList = (from blk in dbContext.Buildings
                                                         join tmpReading in dbContext.TempReadings
                                                         on eachBlock.Id equals tmpReading.BuildingFkId
                                                         where blk.Id == eachBlock.Id
                                                         &&
                                                         DbFunctions.CreateTime(tmpReading.Timestamp.Hour, tmpReading.Timestamp.Minute, tmpReading.Timestamp.Second) >=
                                                         DbFunctions.CreateTime(blk.WorkingPeriodStart.Value.Hour, blk.WorkingPeriodStart.Value.Minute, blk.WorkingPeriodStart.Value.Second)
                                                         &&
                                                         DbFunctions.CreateTime(tmpReading.Timestamp.Hour, tmpReading.Timestamp.Minute, tmpReading.Timestamp.Second) <=
                                                         DbFunctions.CreateTime(blk.WorkingPeriodEnd.Value.Hour, blk.WorkingPeriodEnd.Value.Minute, blk.WorkingPeriodEnd.Value.Second)
                                                         && (tmpReading.IsProcess == null || tmpReading.IsProcess == false)
                                                         select tmpReading).AsNoTracking().ToList();

                        if (readingList.Count > 0)
                        {
                            DateTime? minDate = dbContext.TempReadings.Where(x => x.BuildingFkId == eachBlock.Id && x.IsProcess == null || x.IsProcess == false).Min(x => x.Timestamp);
                            DateTime? maxdate = dbContext.TempReadings.Where(x => x.BuildingFkId == eachBlock.Id && x.IsProcess == null || x.IsProcess == false).Max(x => x.Timestamp);

                            foreach (AlertRuleSetup eachAlertRuleSetup in alertRuleSetupList)
                            {
                                //find all un-processed TempReading list for current AlertRuleSetup context of the current block context.
                                List<TempReading> alertReadings = readingList.Where(x => x.BuildingFkId == eachAlertRuleSetup.BuildingFkId && x.ObjectFkId == eachAlertRuleSetup.ObjectFkId && x.DataFieldFkId == eachAlertRuleSetup.DataFieldFkId).OrderBy(r => r.Timestamp).ToList();

                                foreach (TempReading eachAlertReading in alertReadings)
                                {
                                    byte condition = 0;
                                    if (eachAlertReading.Timestamp != null)
                                    {
                                        double valueInPercent = 0;
                                        double readingValue = eachAlertReading.Value;
                                        double referenceValue = eachAlertRuleSetup.ReferenceValue.GetValueOrDefault();
                                        if (referenceValue != 0)
                                        {
                                            valueInPercent = (100 * (readingValue - referenceValue)) / Math.Abs(referenceValue);
                                        }

                                        double getPercentageValueOfCustomValueOfThresholdValue = (referenceValue / 100) * readingValue;
                                        getPercentageValueOfCustomValueOfThresholdValue = (referenceValue - getPercentageValueOfCustomValueOfThresholdValue);
                                        condition = CheckAlertRuleCondition(valueInPercent, getPercentageValueOfCustomValueOfThresholdValue, byte.Parse(eachAlertRuleSetup.Condition.ToString()));
                                    }

                                    if (condition != 0)
                                    {
                                        SaveAlertData(eachAlertReading, eachAlertRuleSetup);
                                    }
                                }
                            }

                            if (minDate != null && maxdate != null)
                            {
                                EFBatchOperation.For(dbContext, dbContext.TempReadings)
                                    .Where(b => b.BuildingFkId == eachBlock.Id && b.Timestamp >= minDate && b.Timestamp <= maxdate &&
                                    (b.IsProcess == null || b.IsProcess == false)).Update(b => b.IsProcess, b => true);
                            }
                        }
                    }
                }

                EFBatchOperation.For(dbContext, dbContext.AlertDatas).InsertAll(alertDataList);
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
            }
        }

        [HttpGet]
        [Route("api/mailalertdata")]
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


        [HttpGet]
        [Route("api/readsuppress")]
        public Output ReadSuppress()
        {
            Output output = new Output();
            try
            {
                var model = dbContext.AlertSuppresses.ToList();
                output.model = model.Select(e => new { Id = e.Id, StartDate = e.From_Date, EndDate = e.to_Date });
                output.okay = true;
            }
            catch (Exception ex)
            {
                output.okay = false;
                output.message = ex.Message;
            }
            return output;
        }

        [HttpPost]
        [Route("api/createsuppress")]
        public Output CrateSuppress(AlertSuppress model)
        {
            Output output = new Output();
            if (ModelState.IsValid)
            {
                var model1 = new AlertSuppress
                {
                    From_Date = DateTime.Now,//model.From_Date,
                    to_Date = model.to_Date
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

        [HttpPost]
        [Route("api/updatesuppress")]
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

        [HttpPost]
        [Route("api/removesuppress")]
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

        [HttpGet]
        [Route("api/alert/loadalertlist")]
        public object LoadAlertList()
        {

            DateTime? endDate = null;
            DateTime? startDate = null;
            var queryString = Request.GetQueryNameValuePairs()
                .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);

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
                    query = query.Where(e => e.FromDateTime >= startDate && e.ToDateTime <= endDate);

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
                    FMCCStatus = e.FMCCStatus
                }).ToList();

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
                    FMCCStatus = e.FMCCStatus
                }).ToList();
                return new
                {
                    data = filteredData
                };
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return new List<int>();
            }

        }
        [HttpPost]
        [Route("api/alert/setundefined")]
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

        [HttpPost]
        [Route("/api/alert/setacknowledged")]
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

        [HttpGet]
        [Route("api/mailalertdata")]
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
    }

}
