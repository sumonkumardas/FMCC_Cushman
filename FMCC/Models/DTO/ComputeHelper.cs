using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;
using Fmcc.Models.DTO;
using Fmcc.Models.EntityDataModel;

namespace Fmcc.Models.DTO
{
    public class ComputeHelper
    {
        // return universal timestamp from a date time
        public static double GetUtcTimestamp(DateTime date)
        {
            return TimeSpan.FromTicks(date.Ticks).TotalMilliseconds -
                       TimeSpan.FromTicks(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).Ticks).TotalMilliseconds;
        }

        public static List<List<double?>> GetCompareData(List<TempReading> data, DateTime date)
        {
            List<List<double?>> returnData = new List<List<double?>>();

            foreach (var d in data)
            {

                List<double?> tempData = new List<double?>();
                DateTime dt = DateTime.ParseExact(date.ToString("yyyy-MM-dd") + "T" + d.Timestamp.ToString("HH:mm:ss"), "yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture);
                tempData.Add(GetUtcTimestamp(dt));
                tempData.Add(Math.Round(d.Value, 2));
                returnData.Add(tempData);

            }

            return returnData;
        }
        
        public static List<List<double?>> GetCompareDataSingleDate(List<TempReading> data)
        {
            List<List<double?>> returnData = new List<List<double?>>();

            foreach (var d in data)
            {

                List<double?> tempData = new List<double?>();
                tempData.Add(GetUtcTimestamp(d.Timestamp));
                tempData.Add(Math.Round(d.Value, 2));
                returnData.Add(tempData);

            }

            return returnData;
        }

    }
}