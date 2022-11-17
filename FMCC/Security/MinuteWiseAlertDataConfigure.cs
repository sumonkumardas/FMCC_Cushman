using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using Fmcc.Controllers.ServiceControllers;
using Fmcc.Models;

namespace Fmcc.Security
{
    public class MinuteWiseAlertDataConfigure
    {
        public static List<AlertDataResult> GetMinuteWiseAlertDataList(List<int> justUserGroupList, List<AlertDataResult> mainAlertDataList)
        {
            try
            {
                List<AlertDataResult> alertDataResult = new List<AlertDataResult>();
                for (int i = 0; i < justUserGroupList.Count; i++)
                {

                    // find out list by user id

                    int userId = int.Parse(justUserGroupList[i].ToString());

                    List<AlertDataResult> getUserIdWiseAlertDataList = mainAlertDataList.Where(x => x.UserId == userId).ToList();
                    List<AlertDataResult> tempUserIdWiseAlertDataList = mainAlertDataList.Where(x => x.UserId == userId).ToList();

                    int y = 1;
                    for (int x = 0; x < getUserIdWiseAlertDataList.Count; x++)
                    {
                        int alHour = getUserIdWiseAlertDataList[x].Timestamp.Value.Hour;
                        int alMin = getUserIdWiseAlertDataList[x].Timestamp.Value.Minute;
                        int alSec = getUserIdWiseAlertDataList[x].Timestamp.Value.Second;

                        if (y == tempUserIdWiseAlertDataList.Count) y = x + 1;

                        while (y < tempUserIdWiseAlertDataList.Count)
                        {

                            int talHour = tempUserIdWiseAlertDataList[y].Timestamp.Value.Hour;
                            int talMin = tempUserIdWiseAlertDataList[y].Timestamp.Value.Minute;
                            int talSec = tempUserIdWiseAlertDataList[y].Timestamp.Value.Second;

                            TimeSpan ts = TimeSpan.Parse(talHour.ToString() + ":" + talMin.ToString() + ":" + talSec.ToString()) - TimeSpan.Parse(alHour.ToString() + ":" + alMin.ToString() + ":" + alSec.ToString());
                            int tsMinute = ts.Minutes;
                            int tsHour = ts.Hours;
                            if (tsHour == 0 && tsMinute == 1)
                            {
                                AlertDataResult adr = new AlertDataResult();

                                adr.UserId = tempUserIdWiseAlertDataList[y].UserId;
                                adr.Id = (tempUserIdWiseAlertDataList[y].Id == null) ? "" : tempUserIdWiseAlertDataList[y].Id.ToString();
                                adr.FullName = tempUserIdWiseAlertDataList[y].FullName;
                                adr.Email = tempUserIdWiseAlertDataList[y].Email;
                                adr.Severity = tempUserIdWiseAlertDataList[y].Severity.ToString();
                                adr.blFkId = tempUserIdWiseAlertDataList[y].blFkId;
                                adr.BuildingName = tempUserIdWiseAlertDataList[y].BuildingName;
                                adr.objName = tempUserIdWiseAlertDataList[y].objName;
                                adr.DataFieldName = tempUserIdWiseAlertDataList[y].DataFieldName;
                                adr.ReadingValue = tempUserIdWiseAlertDataList[y].ReadingValue;
                                adr.BaselineValue = tempUserIdWiseAlertDataList[y].BaselineValue.ToString();
                                adr.Timestamp = tempUserIdWiseAlertDataList[y].Timestamp;
                                adr.IsEmail = tempUserIdWiseAlertDataList[y].IsEmail;
                                adr.IsSMS = tempUserIdWiseAlertDataList[y].IsSMS;
                                adr.MobileNo = tempUserIdWiseAlertDataList[y].MobileNo;
                                adr.Condition = tempUserIdWiseAlertDataList[y].Condition.ToString();
                                adr.AlertRoleValue = tempUserIdWiseAlertDataList[y].AlertRoleValue;
                                adr.BaselineRange = tempUserIdWiseAlertDataList[y].BaselineRange;
                                adr.AlertText = tempUserIdWiseAlertDataList[y].AlertText;

                                alertDataResult.RemoveAll(r => r.UserId == adr.UserId && r.Timestamp == adr.Timestamp);  // delete every previous record according to userId and timestamp
                                alertDataResult.Add(adr);  // add new record in list

                                adr = new AlertDataResult();
                                adr.UserId = getUserIdWiseAlertDataList[x].UserId;
                                adr.Id = (getUserIdWiseAlertDataList[x].Id == null) ? "" : getUserIdWiseAlertDataList[x].Id.ToString();
                                adr.FullName = getUserIdWiseAlertDataList[x].FullName;
                                adr.Email = getUserIdWiseAlertDataList[x].Email;
                                adr.Severity = getUserIdWiseAlertDataList[x].Severity.ToString();
                                adr.blFkId = getUserIdWiseAlertDataList[x].blFkId;
                                adr.BuildingName = getUserIdWiseAlertDataList[x].BuildingName;
                                adr.objName = getUserIdWiseAlertDataList[x].objName;
                                adr.DataFieldName = getUserIdWiseAlertDataList[x].DataFieldName;
                                adr.ReadingValue = getUserIdWiseAlertDataList[x].ReadingValue;
                                adr.BaselineValue = getUserIdWiseAlertDataList[x].BaselineValue.ToString();
                                adr.Timestamp = getUserIdWiseAlertDataList[x].Timestamp;
                                adr.IsEmail = getUserIdWiseAlertDataList[x].IsEmail;
                                adr.IsSMS = getUserIdWiseAlertDataList[x].IsSMS;
                                adr.MobileNo = getUserIdWiseAlertDataList[x].MobileNo;
                                adr.Condition = getUserIdWiseAlertDataList[x].Condition.ToString();
                                adr.AlertRoleValue = getUserIdWiseAlertDataList[x].AlertRoleValue;
                                adr.BaselineRange = getUserIdWiseAlertDataList[x].BaselineRange;
                                adr.AlertText = getUserIdWiseAlertDataList[x].AlertText;

                                alertDataResult.RemoveAll(r => r.UserId == adr.UserId && r.Timestamp == adr.Timestamp);  // delete every previous record according to userId and timestamp
                                alertDataResult.Add(adr);   // add new record in list

                                y++;
                                break;
                            }
                            y++;
                        }
                    }
                }
                return alertDataResult;
            }
            catch { return null; }
        }

        public byte Check_Set_Condition_Severity(double valuePer, double alertRoleValue, byte condition)
        {
            try
            {
                // condition list is : 1=Above,2=Below,3=Avobe equal, 4=Below equal
                switch (condition)
                {
                    case 1:
                        if (valuePer < 0) // first time check value is negative ?negative value means reading value is grather then baseline value
                        {
                            if (Math.Abs(valuePer) > alertRoleValue)
                            {
                                return 1;  // for above  
                            }
                            return 0;
                        }
                        return 0;
                    case 2:
                        if (valuePer > 0)  // first time check value is positive ?positive value means reading value is less then baseline value
                        {
                            if (valuePer < alertRoleValue)
                            {
                                return 2;// for below
                            }
                            return 0;
                        }
                        return 0;
                    case 3:
                        if (valuePer < 0) // first time check value is negative ?negative value means reading value is grather then baseline value
                        {
                            if (Math.Abs(valuePer) > alertRoleValue)
                            {
                                return 3;  // for above  
                            }
                            return 0;
                        }
                        if (valuePer > 0)  // first time check value is positive ?positive value means reading value is less then baseline value
                        {
                            if (valuePer < alertRoleValue)
                            {
                                return 3;// for below
                            }
                            return 0;
                        }
                        return 0;
                        //case 3:
                        //    if (valuePer < 0) // first time check value is negative ?negative value means reading value is grather then or equal baseline value
                        //    {
                        //        if (Math.Round(valuePer) >= alertRoleValue) return 3; // fro above equal
                        //        return 0;
                        //    }
                        //    return 0;
                        //case 4:
                        //    if (valuePer > 0)  // first time check value is positive ?positive value means reading value is less then or equal baseline value
                        //    {
                        //        if (valuePer <= alertRoleValue) return 4;// for below equal
                        //        return 0;
                        //    }
                        //    return 0;
                }
                return 0;   // without need
            }
            catch { return 0; }

        }

        public static int? GetMoreOccuredSeverity(int fromIndex, int toIndex, List<AlertDataResult> tempAlertDataList)
        {
            try
            {
                ArrayList one = new ArrayList();   // one=Minor
                ArrayList two = new ArrayList();   // two=Major
                ArrayList three = new ArrayList();  // three=critical
                for (int i = fromIndex; i <= toIndex; i++)
                {
                    if (tempAlertDataList[i].Severity == "1") one.Add(1);
                    else if (tempAlertDataList[i].Severity == "2") two.Add(2);
                    else if (tempAlertDataList[i].Severity == "3") three.Add(3);
                }

                if (one.Count > two.Count && one.Count > three.Count) return 1;
                else if (two.Count > one.Count && two.Count > three.Count) return 2;
                else if (three.Count > one.Count && three.Count > two.Count) return 3;

                else if (one.Count == two.Count && one.Count == three.Count) return 1;

                else if (one.Count == two.Count && one.Count > three.Count) return 1;
                else if (one.Count == three.Count && one.Count > two.Count) return 1;

                else if (two.Count == one.Count && two.Count > three.Count) return 2;
                else if (two.Count == three.Count && two.Count > one.Count) return 2;

                else if (three.Count == one.Count && three.Count > two.Count) return 3;
                else if (three.Count == two.Count && three.Count > one.Count) return 3;

                return null;
            }
            catch { return null; }
        }

        public static string GetAlertStatus(int Severity)
        {
            try
            {
                switch (Severity)
                {
                    case 1:
                        return "Minor";

                    case 2:
                        return "Major";

                    case 3:
                        return "Critical";

                }
                return "";
            }
            catch (System.Exception exception)
            {
                return exception.Message;
            }
        }

        public static string GetCondition(int condition, string alertRoleValule)
        {
            try
            {
                switch (condition)
                {
                    case 1:
                        return alertRoleValule + "% Above";
                    case 2:
                        return alertRoleValule + "% Below";
                    case 3:
                        return "Deviation";

                }
                return "";
            }
            catch { return null; }
        }

        public static string FindOutBelowAboveByDeviative(double readingValue, double baselineValue, string alertRoleValule)
        {
            try
            {
                if (readingValue > baselineValue) return alertRoleValule + "% Above";
                else if (readingValue < baselineValue) return alertRoleValule + "% Below";
                return null;
            }
            catch { return null; }
        }
    }
}