using Fmcc.Models.EntityDataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Fmcc.Controllers
{
    public class RaspberryPiReadingController : ApiController
    {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public void Get([FromUri] RaspberryPiReading readingObject)
        {
            var tempReadingList = new List<TempReading>();
            try
            {
                using (var db = new FMCCDataContext())
                {

                    var buildingIdFkTemp= db.Buildings.Where(r => r.BuildingId == readingObject.BuildingId).Select(s => s.Id).FirstOrDefault();
                    var buildingIdTemp= readingObject.BuildingId;
                    var objectFkId = db.Objects.Where(r => r.ObjectId == "Air").Select(s => s.Id).FirstOrDefault();
                    //----Pm1-------------//
                    if (readingObject.Pm1 != null)
                    {
                        var tempReadingPm1 = new TempReading();

                        tempReadingPm1.BuildingFkId = buildingIdFkTemp;
                        tempReadingPm1.BuildingId = buildingIdTemp;
                        tempReadingPm1.ObjectFkId = objectFkId;
                        tempReadingPm1.ObjectId = "Air";
                        tempReadingPm1.ObjectNo = 1;
                        tempReadingPm1.DataFieldFkId = db.DataFields.Where(r => r.DataFieldId == "Pm1").Select(s => s.Id).FirstOrDefault();
                        tempReadingPm1.DataFieldId = "Pm1";
                        tempReadingPm1.Value = Convert.ToDouble(readingObject.Pm1);
                        tempReadingPm1.Timestamp = Convert.ToDateTime(readingObject.TimeStamp);
                        tempReadingPm1.ExpressionColumn = "Air" + "1" + "Pm1";
                        tempReadingPm1.IsProcess = false;
                        tempReadingPm1.UtcTimestamp = GetUtcTimestamp(Convert.ToDateTime(readingObject.TimeStamp));

                        tempReadingList.Add(tempReadingPm1);
                    }



                    //----Pm2d5-------------//
                    if (readingObject.Pm2d5 != null)
                    {
                        var tempReadingPm2d5 = new TempReading();

                        tempReadingPm2d5.BuildingFkId = buildingIdFkTemp;
                        tempReadingPm2d5.BuildingId = buildingIdTemp;
                        tempReadingPm2d5.ObjectFkId = objectFkId;
                        tempReadingPm2d5.ObjectId = "Air";
                        tempReadingPm2d5.ObjectNo = 1;
                        tempReadingPm2d5.DataFieldFkId = db.DataFields.Where(r => r.DataFieldId == "Pm2d5").Select(s => s.Id).FirstOrDefault();
                        tempReadingPm2d5.DataFieldId = "Pm2d5";
                        tempReadingPm2d5.Value = Convert.ToDouble(readingObject.Pm2d5);
                        tempReadingPm2d5.Timestamp = Convert.ToDateTime(readingObject.TimeStamp);
                        tempReadingPm2d5.ExpressionColumn = "Air" + "1" + "Pm2d5";
                        tempReadingPm2d5.IsProcess = false;
                        tempReadingPm2d5.UtcTimestamp = GetUtcTimestamp(Convert.ToDateTime(readingObject.TimeStamp));

                        tempReadingList.Add(tempReadingPm2d5);
                    }


                    //----Pm10-------------//

                    if (readingObject.Pm10 != null)
                    {
                        var tempReadingPm10 = new TempReading();

                        tempReadingPm10.BuildingFkId = buildingIdFkTemp;
                        tempReadingPm10.BuildingId = buildingIdTemp;
                        tempReadingPm10.ObjectFkId = objectFkId;
                        tempReadingPm10.ObjectId = "Air";
                        tempReadingPm10.ObjectNo = 1;
                        tempReadingPm10.DataFieldFkId = db.DataFields.Where(r => r.DataFieldId == "Pm10").Select(s => s.Id).FirstOrDefault();
                        tempReadingPm10.DataFieldId = "Pm10";
                        tempReadingPm10.Value = Convert.ToDouble(readingObject.Pm10);
                        tempReadingPm10.Timestamp = Convert.ToDateTime(readingObject.TimeStamp);
                        tempReadingPm10.ExpressionColumn = "Air" + "1" + "Pm10";
                        tempReadingPm10.IsProcess = false;
                        tempReadingPm10.UtcTimestamp = GetUtcTimestamp(Convert.ToDateTime(readingObject.TimeStamp));

                        tempReadingList.Add(tempReadingPm10);
                    }



                    //----Temperature-------------//

                    if (readingObject.Temperature != null)
                    {
                        var tempReadingTemperature = new TempReading();

                        tempReadingTemperature.BuildingFkId = buildingIdFkTemp;
                        tempReadingTemperature.BuildingId = buildingIdTemp;
                        tempReadingTemperature.ObjectFkId = objectFkId;
                        tempReadingTemperature.ObjectId = "Air";
                        tempReadingTemperature.ObjectNo = 1;
                        tempReadingTemperature.DataFieldFkId = db.DataFields.Where(r => r.DataFieldId == "Temperature").Select(s => s.Id).FirstOrDefault();
                        tempReadingTemperature.DataFieldId = "Temperature";
                        tempReadingTemperature.Value = Convert.ToDouble(readingObject.Temperature);
                        tempReadingTemperature.Timestamp = Convert.ToDateTime(readingObject.TimeStamp);
                        tempReadingTemperature.ExpressionColumn = "Air" + "1" + "Temperature";
                        tempReadingTemperature.IsProcess = false;
                        tempReadingTemperature.UtcTimestamp = GetUtcTimestamp(Convert.ToDateTime(readingObject.TimeStamp));

                        tempReadingList.Add(tempReadingTemperature);

                    }


                    //----Humidity-------------//

                    if (readingObject.Humidity != null)
                    {
                        var tempReadingHumidity = new TempReading();

                        tempReadingHumidity.BuildingFkId = buildingIdFkTemp;
                        tempReadingHumidity.BuildingId = buildingIdTemp;
                        tempReadingHumidity.ObjectFkId = objectFkId;
                        tempReadingHumidity.ObjectId = "Air";
                        tempReadingHumidity.ObjectNo = 1;
                        tempReadingHumidity.DataFieldFkId = db.DataFields.Where(r => r.DataFieldId == "Humidity").Select(s => s.Id).FirstOrDefault();
                        tempReadingHumidity.DataFieldId = "Humidity";
                        tempReadingHumidity.Value = Convert.ToDouble(readingObject.Humidity);
                        tempReadingHumidity.Timestamp = Convert.ToDateTime(readingObject.TimeStamp);
                        tempReadingHumidity.ExpressionColumn = "Air" + "1" + "Humidity";
                        tempReadingHumidity.IsProcess = false;
                        tempReadingHumidity.UtcTimestamp = GetUtcTimestamp(Convert.ToDateTime(readingObject.TimeStamp));

                        tempReadingList.Add(tempReadingHumidity);

                    }


                    //----AQI-------------//
                    if (readingObject.Humidity != null)
                    {
                        var tempReadingAQI = new TempReading();

                        tempReadingAQI.BuildingFkId = buildingIdFkTemp;
                        tempReadingAQI.BuildingId = buildingIdTemp;
                        tempReadingAQI.ObjectFkId = objectFkId;
                        tempReadingAQI.ObjectId = "Air";
                        tempReadingAQI.ObjectNo = 1;
                        tempReadingAQI.DataFieldFkId = db.DataFields.Where(r => r.DataFieldId == "AQI").Select(s => s.Id).FirstOrDefault();
                        tempReadingAQI.DataFieldId = "AQI";
                        tempReadingAQI.Value = Convert.ToDouble(readingObject.AQI);
                        tempReadingAQI.Timestamp = Convert.ToDateTime(readingObject.TimeStamp);
                        tempReadingAQI.ExpressionColumn = "Air" + "1" + "AQI";
                        tempReadingAQI.IsProcess = false;
                        tempReadingAQI.UtcTimestamp = GetUtcTimestamp(Convert.ToDateTime(readingObject.TimeStamp));

                        tempReadingList.Add(tempReadingAQI);
                    }
                       

                    db.TempReadings.AddRange(tempReadingList);
                    db.SaveChanges();

                }
            }

            catch (System.Exception exception)
            {
                logger.Error(exception.Message);

            }


        }

        public static double GetUtcTimestamp(DateTime date)
        {
            return TimeSpan.FromTicks(date.Ticks).TotalMilliseconds -
                       TimeSpan.FromTicks(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).Ticks).TotalMilliseconds;
        }
    }


    public class RaspberryPiReading
    {
        public string BuildingId { get; set; }
        public string Pm1 { get; set; }
        public string Pm2d5 { get; set; }
        public string Pm10 { get; set; }
        public string Temperature { get; set; }
        public string Humidity { get; set; }
        public string AQI { get; set; }
        public string TimeStamp { get; set; }
    
    }
}
