// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ReportController.cs" company="S3 Innovate Pte. Ltd.">
// Namespace: Fmcc.Controllers
// Class: ReportController
// Author: Md. Nazmul Hossain.
// Notes:
// Create Date: 25 May 2017
// </copyright>
// <summary>
// Class for create RESTful web service. This file contains "ReportController" class
// to create wpi for report module
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.Web.Razor.Generator;
using Fmcc.Extension;
using Fmcc.Utility;

namespace Fmcc.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Globalization;
    using System.Web.Http;
    using Fmcc.Models.EntityDataModel;
    using Fmcc.Models.DTO;
    using Fmcc.Models;
    using System.Diagnostics;
    using System.Data.Entity.SqlServer;
    using System.Web.Http.Cors;

    [EnableCors(origins: "*", headers: "*", methods: "*")]

    public class ReportController : ApiController
    {
        // log4net instance for logging
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [Route("api/report/amrGetDashboardData/{previousStart}/{previousEnd}/{lastStart}/{lastEnd}")]
        public AMRDashboardReportModel GetAMRDashboardData(string previousStart, string previousEnd, string lastStart, string lastEnd)
        {
            DateTime _previousStart;
            DateTime _previousEnd;
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(previousStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousStart);
            DateTime.TryParseExact(previousEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousEnd);
            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            int dateDiff = (_lastEnd - _lastStart).Days;


            AMRDashboardReportModel data = new AMRDashboardReportModel();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    DataDTO objDataDto = new DataDTO();

                    objDataDto = getPowerData("total", "power", null, null, false);
                    if (objDataDto != null)
                    {
                        data.HistoricPeakPower = (objDataDto.Value);
                    }
                    else
                    {
                        data.HistoricPeakPower = 0;
                    }
                    objDataDto = getPowerData("total", "power", DateTime.Now.AddMonths(-6).ToString("yyyy-MM-dd"), DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"), false, true);
                    if (objDataDto != null)
                    {
                        data.HistoricAveragePeakPower = objDataDto.Value;
                    }
                    else
                    {
                        data.HistoricAveragePeakPower = 0;
                    }
                    //objDataDto = getPowerData("total", "power", DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"), DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"), false);
                    objDataDto = getPowerData("total", "power", _lastStart.ToString("yyyy-MM-dd"), _lastEnd.ToString("yyyy-MM-dd"), false);
                    if (objDataDto != null)
                    {
                        data.PowerYesterdayValue = objDataDto.Value;
                    }
                    else
                    {
                        data.PowerYesterdayValue = 0;
                    }
                    //objDataDto = getPowerData("total", "power", DateTime.Now.AddDays(-2).ToString("yyyy-MM-dd"), DateTime.Now.AddDays(-2).ToString("yyyy-MM-dd"), false);
                    objDataDto = getPowerData("total", "power", _previousStart.ToString("yyyy-MM-dd"), _previousEnd.ToString("yyyy-MM-dd"), false);
                    if (objDataDto != null)
                    {
                        data.PowerDayBeforeYesterdayValue = objDataDto.Value;
                    }
                    else
                    {
                        data.PowerDayBeforeYesterdayValue = 0;
                    }

                    objDataDto = getPowerData("total", "power", null, null, true);
                    if (objDataDto != null)
                    {
                        data.HistoricPeakPowerBill = objDataDto.Value;
                    }
                    else
                    {
                        data.HistoricPeakPowerBill = 0;
                    }
                    objDataDto = getPowerData("total", "power", DateTime.Now.AddMonths(-6).ToString("yyyy-MM-dd"), DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"), true, true);
                    if (objDataDto != null)
                    {
                        data.HistoricAveragePeakPowerBill = objDataDto.Value;
                    }
                    else
                    {
                        data.HistoricAveragePeakPowerBill = 0;
                    }
                    //objDataDto = getPowerData("total", "power", DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"), DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd"), true);
                    objDataDto = getPowerData("total", "power", _lastStart.ToString("yyyy-MM-dd"), _lastEnd.ToString("yyyy-MM-dd"), true);
                    if (objDataDto != null)
                    {
                        data.PowerYesterdayValueBill = objDataDto.Value;
                    }
                    else
                    {
                        data.PowerYesterdayValueBill = 0;
                    }
                    //objDataDto = getPowerData("total", "power", DateTime.Now.AddDays(-2).ToString("yyyy-MM-dd"), DateTime.Now.AddDays(-2).ToString("yyyy-MM-dd"), true);
                    objDataDto = getPowerData("total", "power", _lastStart.ToString("yyyy-MM-dd"), _lastEnd.ToString("yyyy-MM-dd"), true);
                    if (objDataDto != null)
                    {
                        data.PowerDayBeforeYesterdayValueBill = objDataDto.Value;
                    }
                    else
                    {
                        data.PowerDayBeforeYesterdayValueBill = 0;
                    }
                    if (data.HistoricPeakPower == 0)
                    {
                        data.HistoricPeakPowerIncreasePercentage = (((data.PowerYesterdayValue - data.HistoricPeakPower) * 100) / 1);
                    }
                    else
                    {
                        data.HistoricPeakPowerIncreasePercentage = (((data.PowerYesterdayValue - data.HistoricPeakPower) * 100) / data.HistoricPeakPower);    
                    }
                    if (data.HistoricPeakPowerBill == 0)
                    {
                        data.HistoricPeakPowerBillIncreasePercentage = (((data.PowerYesterdayValueBill - data.HistoricPeakPowerBill) * 100) / 1);    
                    }
                    else
                    {
                        data.HistoricPeakPowerBillIncreasePercentage = (((data.PowerYesterdayValueBill - data.HistoricPeakPowerBill) * 100) / data.HistoricPeakPowerBill);
                    }
                    

                    DateTime nDayBefore = DateTime.Now.AddDays(-5);
                    data.PowerDayNDates = new List<string>();
                    data.PowerDayNdayValue = new List<double?>();
                    while (nDayBefore < DateTime.Now && nDayBefore.Day != DateTime.Now.Day)
                    {
                        data.PowerDayNDates.Add(nDayBefore.ToString("yyyy-MM-dd"));
                        var dayValues = (from o in db.TempReadings
                                         where
                                         o.Timestamp.Year == nDayBefore.Year
                                         && o.Timestamp.Month == nDayBefore.Month
                                         && o.Timestamp.Day == nDayBefore.Day
                                         select new { o.Timestamp, o.Value }
                                          ).ToList();
                        var sum = dayValues.Select(c => c.Value).Sum();
                        data.PowerDayNdayValue.Add(sum);
                        nDayBefore = nDayBefore.AddDays(1);
                    }

                    nDayBefore = DateTime.Now.AddDays(-5);
                    data.PowerBillDayNDates = new List<string>();
                    data.PowerBillDayNdayValue = new List<double?>();
                    while (nDayBefore < DateTime.Now && nDayBefore.Day != DateTime.Now.Day)
                    {
                        data.PowerBillDayNDates.Add(nDayBefore.ToString("yyyy-MM-dd"));
                        var dayValues = (from o in db.TempReadings
                                         where
                                         o.Timestamp.Year == nDayBefore.Year
                                         && o.Timestamp.Month == nDayBefore.Month
                                         && o.Timestamp.Day == nDayBefore.Day
                                         select new { o.Timestamp, o.Value }
                                          ).ToList();
                        var sum = dayValues.Select(c => c.Value).Sum();
                        data.PowerBillDayNdayValue.Add(sum);
                        nDayBefore = nDayBefore.AddDays(1);
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }
            }
            return data;
        }

        public DataDTO getPowerData(string ObjectId, string dataFieldId, string startDateTime, string endDateTime, bool isBill = false, bool isAvg = false)
        {
            DataDTO objDataDto = new DataDTO();
            using (var db = new FMCCDataContext())
            {
                try
                {
                    if (isBill) // power bill
                    {
                        if (string.IsNullOrEmpty(startDateTime)) // get last three month peak bill
                        {
                            objDataDto = db.Database.SqlQuery<DataDTO>(
                                              @"select TOP 1 tr.Date,
		                                                cast(isnull(
		                                                (
			                                                (isnull(tr.Value,0))*
			                                                isnull((
						                                                select top 1 PowerMonthlyTariff.Tariff 
						                                                from PowerMonthlyTariff 
						                                                where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Date) 
						                                                and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Date)),1))
		                                                ,0) as decimal(16,2)) as Value
                                                from
                                                (
	                                                SELECT cast(Timestamp as date) as [Date], 
			                                                cast(sum(tr.Value) as decimal(16,2)) as Value
	                                                FROM [dbo].[TempReading] tr inner join 
	                                                dbo.Building bldg on tr.BuildingFkId = bldg.Id 
	                                                where cast(tr.Timestamp as date) between DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE())-6, 0) and DATEADD(MONTH, DATEDIFF(MONTH, -1, GETDATE())-1, -1) 
	                                                and ObjectId = '" + ObjectId + @"'  
                                                    and DataFieldId = '" + dataFieldId + @"'
	                                                and bldg.Type = 1
	                                                group by cast(tr.Timestamp as date)
                                                ) as tr
                                                order by Value desc").FirstOrDefault();
                        }
                        else // get the sum with date range power bill
                        {
                            if (isAvg) // the average power bill value
                            {
                                objDataDto = db.Database.SqlQuery<DataDTO>(
                                              @"select CAST(GETDATE() as date) as [Date],
	                                                   cast(AVG(Value) as decimal(16, 2)) as Value
                                                from
                                                (
                                                select tr.Date,
		                                                cast(isnull(
		                                                (
			                                                (isnull(tr.Value,0))*
			                                                isnull((
						                                                select top 1 PowerMonthlyTariff.Tariff 
						                                                from PowerMonthlyTariff 
						                                                where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Date) 
						                                                and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Date)),1))
		                                                ,0) as decimal(16,2)) as Value
                                                from
                                                (
	                                                SELECT cast(Timestamp as date) as [Date], 
			                                                cast(sum(tr.Value) as decimal(16,2)) as Value
	                                                FROM [dbo].[TempReading] tr inner join 
	                                                dbo.Building bldg on tr.BuildingFkId = bldg.Id 
	                                                where cast(tr.Timestamp as date) between '" + startDateTime + @"' and '" + endDateTime + @"'  
                                                    and ObjectId = '" + ObjectId + @"'  
                                                    and DataFieldId = '" + dataFieldId + @"' 
                                                    and bldg.Type = 1
	                                                group by cast(tr.Timestamp as date)
                                                ) as tr
                                                -- order by Value desc
                                                ) as TotalValue").FirstOrDefault();
                            }
                            else // the average power value
                            {
                                objDataDto = db.Database.SqlQuery<DataDTO>(
                                              @"select TOP 1 tr.Date,
		                                                 cast(isnull(
			                                                (
				                                                (isnull(tr.Value,0))*
				                                                isnull((
							                                                select top 1 PowerMonthlyTariff.Tariff 
							                                                from PowerMonthlyTariff 
							                                                where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Date) 
							                                                and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Date)),1))
			                                                ,0) as decimal(16,2)) as Value
                                                  from
                                                  (
	                                                  SELECT cast(Timestamp as date) as [Date], 
			                                                 cast(sum(tr.Value) as decimal(16,2)) as Value
	                                                  FROM [dbo].[TempReading] tr inner join 
	                                                  dbo.Building bldg on tr.BuildingFkId = bldg.Id 
	                                                  where cast(tr.Timestamp as date) between '" + startDateTime + @"' and '" + endDateTime + @"' 
	                                                  and ObjectId = '" + ObjectId + @"' 
                                                      and DataFieldId = '" + dataFieldId + @"'
                                                      and bldg.Type = 1
	                                                  group by cast(tr.Timestamp as date)
                                                  ) as tr
                                                  order by Value desc").FirstOrDefault();
                            }
                        }
                    }
                    else // power
                    {
                        if (string.IsNullOrEmpty(startDateTime)) // get last six month peak 
                        {
                            objDataDto = db.Database.SqlQuery<DataDTO>(
                                              @"SELECT top 1 cast(Timestamp as date) as [Date], cast(sum(Value) as decimal(16,2)) as Value
                                  FROM [dbo].[TempReading] inner join 
	                              dbo.Building bldg on TempReading.BuildingFkId = bldg.Id 
                                  where cast(Timestamp as date) between DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE())-6, 0) and DATEADD(MONTH, DATEDIFF(MONTH, -1, GETDATE())-1, -1) 
                                  and ObjectId = '" + ObjectId + @"' 
                                  and DataFieldId = '" + dataFieldId + @"'
                                  and bldg.Type = 1
                                  group by cast(Timestamp as date)
                                  order by Value desc").FirstOrDefault();
                        }
                        else // get the sum with date range power
                        {
                            if (isAvg) // the average power value
                            {
                                objDataDto = db.Database.SqlQuery<DataDTO>(
                                              @"select CAST(GETDATE() as date) as [Date], cast(AVG(Value) as decimal(16, 2)) as Value
                                                from
                                                (
                                                SELECT cast(Timestamp as date) as [Date], cast(sum(Value) as decimal(16,2)) as Value
                                                FROM [dbo].[TempReading] inner join 
	                                            dbo.Building bldg on TempReading.BuildingFkId = bldg.Id 
                                                where cast(Timestamp as date) between '" + startDateTime + @"' and '" + endDateTime + @"'   
                                                and ObjectId = '" + ObjectId + @"'  
                                                and DataFieldId = '" + dataFieldId + @"' 
                                                and bldg.Type = 1
                                                group by cast(Timestamp as date)
                                                --order by Value desc
                                                ) as TotalValue").FirstOrDefault();
                            }
                            else // the power value
                            {
                                objDataDto = db.Database.SqlQuery<DataDTO>(
                                              @"SELECT top 1 cast(Timestamp as date) as [Date], cast(sum(Value) as decimal(16,2)) as Value
                                  FROM [dbo].[TempReading] inner join 
	                              dbo.Building bldg on TempReading.BuildingFkId = bldg.Id 
                                  where cast(Timestamp as date) between '" + startDateTime + @"' and '" + endDateTime + @"'  
                                  and ObjectId = '" + ObjectId + @"' 
                                  and DataFieldId = '" + dataFieldId + @"'
                                  group by cast(Timestamp as date)
                                  order by Value desc").FirstOrDefault();
                            }
                        }
                    }

                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }
            }
            return objDataDto;
        }

        [Route("api/report/amrpowerconsumption/{blockId}/{datafield}/{previousStart}/{previousEnd}/{lastStart}/{lastEnd}/{siteId}/{buildingType}")]
        public AMRPowerConsumptionReportModel GetAMRPowerConsumption(int blockId, string datafield, string previousStart, string previousEnd, string lastStart, string lastEnd, int siteId, int buildingType)
        {
            DateTime _previousStart;
            DateTime _previousEnd;
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(previousStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousStart);
            DateTime.TryParseExact(previousEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousEnd);
            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            int dateDiff = (_lastEnd - _lastStart).Days;

            AMRPowerConsumptionReportModel data = new AMRPowerConsumptionReportModel();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var unit = ""; //db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == datafield).UnitName;

                    var previous = (from bldg in db.Buildings
                                    where bldg.Type == buildingType
                                    group bldg by new { BuildingFkId = bldg.Id, bldg.BuildingId, bldg.GFA, bldg.BedNo } into g
                                    select new AMRPowerData
                                    {
                                        bId = g.Key.BuildingFkId,
                                        y = (
                                                from tr in db.TempReadings
                                                where tr.Timestamp >= _previousStart
                                                && tr.Timestamp <= _previousEnd
                                                && tr.BuildingFkId == g.Key.BuildingFkId
                                                && tr.BuildingId == g.Key.BuildingId
                                                && tr.ObjectId == "total"
                                                && tr.DataFieldId == "power"
                                                group tr by 1 into gg
                                                select Math.Round(gg.Sum(item => item.Value), 2)
                                            ).FirstOrDefault(),
                                        color = "#f7a35c",
                                        GFA = g.Key.GFA,
                                        BedNo = g.Key.BedNo,
                                        x = g.Key.BuildingFkId,
                                        low = 0,
                                        high = 0,
                                        prevY = 0
                                    });

                    var lastPrev = (from bldg in db.Buildings
                                    where bldg.Type == buildingType
                                    group bldg by new { BuildingFkId = bldg.Id, bldg.BuildingId, bldg.GFA, bldg.BedNo } into g
                                    select new AMRPowerData
                                    {
                                        bId = g.Key.BuildingFkId,
                                        y = (
                                                from tr in db.TempReadings
                                                where tr.Timestamp >= _lastStart
                                                && tr.Timestamp <= _lastEnd
                                                && tr.BuildingFkId == g.Key.BuildingFkId
                                                && tr.BuildingId == g.Key.BuildingId
                                                && tr.ObjectId == "total"
                                                && tr.DataFieldId == "power"
                                                group tr by 1 into gg
                                                select Math.Round(gg.Sum(item => item.Value), 2)
                                            ).FirstOrDefault(),
                                        color = "#bddaf5",
                                        GFA = g.Key.GFA,
                                        BedNo = g.Key.BedNo,
                                        x = g.Key.BuildingFkId,
                                        low = 0,
                                        high = 0,
                                        prevY = 0
                                    }).OrderByDescending(l => l.y);

                    var last = (from lst in lastPrev
                                join prv in previous on lst.bId equals prv.bId
                                select new AMRPowerData
                                {
                                    bId = lst.bId,
                                    y = lst.y,
                                    color = lst.y > prv.y ? "#e74c3c" : lst.y < prv.y ? "#2ecc71" : "#bddaf5",
                                    GFA = lst.GFA,
                                    BedNo = lst.BedNo,
                                    x = lst.bId,
                                    low = 0,
                                    high = lst.y,
                                    prevY = prv.y
                                }
                                ).OrderByDescending(l => l.y);

                    var prevNew = (from prv in previous
                                   join lst in last on prv.bId equals lst.bId
                                   orderby lst.y descending
                                   select new AMRPowerData
                                   {
                                       bId = prv.bId,
                                       y = prv.y,
                                       color = "#f7a35c",
                                       GFA = prv.GFA,
                                       BedNo = prv.BedNo,
                                       x = prv.bId,
                                       low = prv.y,
                                       high = prv.y,
                                       prevY = prv.y
                                   }
                                );

                    var xCategories = (from bldg in db.Buildings
                                       join lstData in lastPrev on bldg.Id equals lstData.bId
                                       where bldg.Type == buildingType
                                       group bldg by new { BuildingFkId = bldg.Id, bldg.ShortName, lstData.y } into g
                                       orderby g.Key.y descending
                                       select g.Key.ShortName).ToList();

                    data.TotalPowerConsumptionLast = Math.Round((from lst in lastPrev select lst.y).Sum(), 2);

                    data.LastPeak = Math.Round((from lst in lastPrev select lst.y).Max(), 2);
                    data.LastAverage = Math.Round((from lst in lastPrev select lst.y).Average(), 2);

                    data.TotalPowerConsumptionPrevious = Math.Round((from prev in previous select prev.y).Sum(), 2);
                    if (data.TotalPowerConsumptionPrevious <= 0)
                    {
                        if (data.TotalPowerConsumptionLast > 0)
                        {
                            data.TotalPowerConsumptionUpgradePercentage = 100.00;
                        }
                        else
                        {
                            data.TotalPowerConsumptionUpgradePercentage = 0.00;
                        }
                    }
                    else
                    {
                        data.TotalPowerConsumptionUpgradePercentage = Math.Round((((data.TotalPowerConsumptionLast -
                                                                     data.TotalPowerConsumptionPrevious) * 100) /
                                                                   data.TotalPowerConsumptionPrevious), 2);
                    }

                    var biggestIncrease = db.Database.SqlQuery<PowerUpgrdateModel>(
                               @";with cteTempLast as
                                  (
                                    SELECT bldg.Id as BuildingFkId, 
                                    ShortName as BuildingId, 
                                    isnull((select sum(isnull(tr.value,0)) from [TempReading] tr where CAST(tr.Timestamp as date) between '" + _lastStart.ToString("yyyy-MM-dd") + @"' and '" + _lastEnd.ToString("yyyy-MM-dd") + @"' and tr.BuildingFkId = bldg.Id  and ObjectId = 'total' and DataFieldId = 'power'),0) as Total
                                    FROM dbo.Building bldg
                                    where bldg.Type = " + buildingType + @" 
                                    group by bldg.Id, ShortName
                                  ),
                                  cteTempPrev as 
                                  (
                                    SELECT bldg.Id as BuildingFkId, 
                                    ShortName as BuildingId, 
                                    isnull((select sum(isnull(tr.value,0)) from [TempReading] tr where CAST(tr.Timestamp as date) between '" + _previousStart.ToString("yyyy-MM-dd") + @"' and '" + _previousEnd.ToString("yyyy-MM-dd") + @"' and tr.BuildingFkId = bldg.Id  and ObjectId = 'total' and DataFieldId = 'power'),0) as Total
                                    FROM dbo.Building bldg
                                    where bldg.Type = " + buildingType + @" 
                                    group by bldg.Id, ShortName
                                  )
                                  select top 1 
	                                     dataT.BuildingFkId, 
	                                     dataT.BuildingId,
	                                     dataT.TempDifference,
	                                     dataT.DiffPercentage
                                  from
                                  (
	                                  select cteTempLast.*, 
		                                     cast((cteTempLast.Total-cteTempPrev.Total) as decimal(18,2)) as TempDifference,
		                                     case when (cteTempPrev.Total = 0 and cteTempLast.Total>0) then 100.00 when (cteTempPrev.Total > 0 and cteTempLast.Total<= 0) then 0.00 when (cteTempPrev.Total = 0 and cteTempLast.Total = 0) then 0.00  else cast(((cteTempLast.Total-cteTempPrev.Total)/cteTempPrev.Total) as decimal(18,2)) end as DiffPercentage,
		                                     ROW_NUMBER() over (order by ((cteTempLast.Total-cteTempPrev.Total))) as rn 
	                                  from cteTempLast inner join cteTempPrev 
	                                  on cteTempLast.BuildingFkId = cteTempPrev.BuildingFkId
	                                  and cteTempLast.BuildingId = cteTempPrev.BuildingId
	                                  where (cteTempLast.Total-cteTempPrev.Total) is not null
                                  ) as dataT
                                  where TempDifference <> 0
                                  order by rn desc").ToList();
                    var biggestDecrease = db.Database.SqlQuery<PowerUpgrdateModel>(
                               @";with cteTempLast as
                                  (
                                     SELECT bldg.Id as BuildingFkId, 
                                     ShortName as BuildingId, 
                                     isnull((select sum(isnull(tr.value,0)) from [TempReading] tr where CAST(tr.Timestamp as date) between '" + _lastStart.ToString("yyyy-MM-dd") + @"' and '" + _lastEnd.ToString("yyyy-MM-dd") + @"' and tr.BuildingFkId = bldg.Id  and ObjectId = 'total'  and DataFieldId = 'power'),0) as Total
                                     FROM dbo.Building bldg
                                     where bldg.Type = " + buildingType + @"  
                                     group by bldg.Id, ShortName 
                                  ),
                                  cteTempPrev as 
                                  (
                                     SELECT bldg.Id as BuildingFkId, 
                                     ShortName as BuildingId, 
                                     isnull((select sum(isnull(tr.value,0)) from [TempReading] tr where CAST(tr.Timestamp as date) between '" + _previousStart.ToString("yyyy-MM-dd") + @"' and '" + _previousEnd.ToString("yyyy-MM-dd") + @"' and tr.BuildingFkId = bldg.Id  and ObjectId = 'total'  and DataFieldId = 'power'),0) as Total
                                     FROM dbo.Building bldg
                                     where bldg.Type = " + buildingType + @"  
                                     group by bldg.Id, ShortName
                                  )
                                  select top 1 
	                                     dataT.BuildingFkId, 
	                                     dataT.BuildingId,
	                                     dataT.TempDifference,
	                                     dataT.DiffPercentage
                                  from
                                  (
	                                  select cteTempLast.*, 
		                                     cast((cteTempLast.Total-cteTempPrev.Total) as decimal(18,2)) as TempDifference,
		                                     case when (cteTempLast.Total-cteTempPrev.Total)>=0 then 0.00 when (cteTempPrev.Total = 0 and cteTempLast.Total>0) then 0.00 when (cteTempPrev.Total > 0 and cteTempLast.Total = 0) then -100.00 when (cteTempPrev.Total = 0 and cteTempLast.Total = 0) then 0.00  else cast((((cteTempLast.Total-cteTempPrev.Total)*100)/cteTempLast.Total) as decimal(18,2)) end as DiffPercentage,
		                                     ROW_NUMBER() over (order by ((cteTempLast.Total-cteTempPrev.Total))) as rn 
	                                  from cteTempLast inner join cteTempPrev 
	                                  on cteTempLast.BuildingFkId = cteTempPrev.BuildingFkId
	                                  and cteTempLast.BuildingId = cteTempPrev.BuildingId
	                                  where (cteTempLast.Total-cteTempPrev.Total) is not null
                                  ) as dataT
                                  where TempDifference <> 0
                                  order by rn").ToList();
                    if (biggestIncrease.Count > 0)
                    {
                        data.BiggestIncreaseLastLabel = biggestIncrease[0].BuildingId;
                        data.BiggestIncreaseLast = biggestIncrease[0].TempDifference;
                        data.BiggestIncreaseUpgradePercentage = biggestIncrease[0].DiffPercentage;
                    }
                    else
                    {
                        data.BiggestIncreaseLastLabel = "";
                        data.BiggestIncreaseLast = 0;
                        data.BiggestIncreaseUpgradePercentage = 0;
                    }

                    if (biggestDecrease.Count > 0)
                    {
                        data.BiggestDecreaseLastLabel = biggestDecrease[0].BuildingId;
                        data.BiggestDecreaseLast = biggestDecrease[0].TempDifference;
                        data.BiggestDecreaseUpgradePercentage = biggestDecrease[0].DiffPercentage;
                    }
                    else
                    {
                        data.BiggestDecreaseLastLabel = "";
                        data.BiggestDecreaseLast = 0;
                        data.BiggestDecreaseUpgradePercentage = 0;
                    }


                    List<AMRPowerData> lstLastDataTemp = new List<AMRPowerData>();
                    lstLastDataTemp = last.ToList();
                    List<AMRPowerData> lstLastData = new List<AMRPowerData>();
                    int xCount = -1;
                    foreach (var vrLastNew in lstLastDataTemp)
                    {
                        xCount++;
                        if (vrLastNew.y > vrLastNew.prevY)
                        {
                            vrLastNew.x = xCount;
                            vrLastNew.low = 0;
                            vrLastNew.high = vrLastNew.prevY;
                            vrLastNew.color = "#bddaf5"; // normal color prev when was equal
                            lstLastData.Add(vrLastNew);

                            lstLastData.Add(new AMRPowerData()
                            {
                                x = xCount,
                                low = vrLastNew.prevY,
                                high = vrLastNew.y,
                                bId = vrLastNew.bId,
                                y = vrLastNew.y,
                                prevY = vrLastNew.y,
                                color = "#FFFF00",//"#e74c3c",
                                GFA = vrLastNew.GFA,
                                BedNo = vrLastNew.BedNo
                            });
                        }
                        else
                        {
                            vrLastNew.x = xCount;
                            vrLastNew.low = 0;
                            vrLastNew.high = vrLastNew.y;
                            vrLastNew.color = "#bddaf5"; // green color
                            lstLastData.Add(vrLastNew);
                        }
                    }

                    List<AMRPowerData> listPrevData = new List<AMRPowerData>();
                    listPrevData = prevNew.ToList();
                    xCount = -1;
                    foreach (var vrListPrevData in listPrevData)
                    {
                        xCount++;
                        vrListPrevData.low = vrListPrevData.y;
                        vrListPrevData.high = vrListPrevData.y;
                        vrListPrevData.x = xCount;
                    }

                    data.Previous = listPrevData;//prevNew.ToList();
                    data.Last = lstLastData;//last.ToList();
                    data.XCategories = xCategories;
                    data.Unit = unit;
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }
            }
            return data;

        }

        [Route("api/report/amrpowerconsumptionblockview/{blockId}/{datafield}/{previousStart}/{previousEnd}/{lastStart}/{lastEnd}/{siteId}/{buildingType}")]
        public AMRPowerConsumptionBlockViewReportModel GetAMRPowerConsumptionBlockView(int blockId, string datafield, string previousStart, string previousEnd, string lastStart, string lastEnd, int siteId, int buildingType)
        {
            DateTime _previousStart;
            DateTime _previousEnd;
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(previousStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousStart);
            DateTime.TryParseExact(previousEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousEnd);
            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            int dateDiff = (_lastEnd - _lastStart).Days;

            AMRPowerConsumptionBlockViewReportModel data = new AMRPowerConsumptionBlockViewReportModel();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var unit = ""; //db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == datafield).UnitName;

                    var last = getBlockHourWisePowerData(blockId, _lastStart, _lastEnd);
                    var previousPrevious = getBlockHourWisePowerData(blockId, _previousStart, _previousEnd);

                    var previous = (from prv in previousPrevious
                                    join lst in last on prv.RN equals lst.RN
                                    select new AMRDataBlockView
                                    {
                                        bId = lst.bId,
                                        y = prv.y,
                                        color = "#f7a35c",
                                        GFA = prv.GFA,
                                        BedNo = prv.BedNo,
                                        RN = prv.RN,
                                        prevY = prv.y
                                    }
                                  ).OrderBy(l => l.RN).ToList();

                    var lastNew = (from lst in last
                                   join prv in previous on lst.RN equals prv.RN
                                   select new AMRDataBlockView
                                   {
                                       bId = lst.bId,
                                       y = lst.y,
                                       color = lst.y > prv.y ? "#e74c3c" : lst.y < prv.y ? "#2ecc71" : "#bddaf5",
                                       GFA = lst.GFA,
                                       BedNo = lst.BedNo,
                                       RN = lst.RN,
                                       prevY = prv.y
                                   }
                                  ).OrderBy(l => l.RN).ToList();

                    var today = DateTime.Today;
                    var month = new DateTime(today.Year, today.Month, 1);
                    var firstDate = month.AddMonths(-6);
                    var lastDate = month.AddDays(-1);
                    double LastNMonthPeak = (db.TempReadings.Where(tr => tr.Timestamp >= firstDate && tr.Timestamp <= lastDate).Max(tr => tr.Value));
                    data.LastPeak = Math.Round((LastNMonthPeak), 2);//Math.Round((from lst in last select lst.y).Max()*2, 2);
                    //data.LastAverage = Math.Round((from lst in last select lst.y).Average(), 2);
                    data.LastAverage = Math.Round(Convert.ToDouble((from bldg in db.Buildings where bldg.Id == blockId select bldg.ContractCapacity).FirstOrDefault()), 2); // now this is contact capacity
                    List<AMRDataBlockView> lstLastData = new List<AMRDataBlockView>();
                    foreach (var vrLastNew in lastNew)
                    {
                        //if (vrLastNew.y > vrLastNew.prevY)
                        if (vrLastNew.y > data.LastPeak)
                        {
                            vrLastNew.x = vrLastNew.RN;
                            vrLastNew.low = 0;
                            vrLastNew.high = data.LastPeak;//vrLastNew.prevY;
                            vrLastNew.color = "#bddaf5";//FFFF00 new logic yellow color//"#bddaf5"; // normal color prev when was equal
                            lstLastData.Add(vrLastNew);

                            lstLastData.Add(new AMRDataBlockView()
                            {
                                x = vrLastNew.RN,
                                RN = vrLastNew.RN,
                                low = data.LastPeak,//vrLastNew.prevY,
                                high = vrLastNew.y > data.LastAverage? data.LastAverage : vrLastNew.y,
                                bId = vrLastNew.bId,
                                y = vrLastNew.y,
                                prevY = vrLastNew.y,
                                color = "#FFA500", // "#e74c3c",
                                GFA = vrLastNew.GFA,
                                BedNo = vrLastNew.BedNo
                            });

                            if (vrLastNew.y > data.LastAverage)
                            {
                                lstLastData.Add(new AMRDataBlockView()
                                {
                                    x = vrLastNew.RN,
                                    RN = vrLastNew.RN,
                                    low = data.LastAverage,//vrLastNew.prevY,
                                    high = vrLastNew.y,
                                    bId = vrLastNew.bId,
                                    y = vrLastNew.y,
                                    prevY = vrLastNew.y,
                                    color = "#ff0000", // "#e74c3c",
                                    GFA = vrLastNew.GFA,
                                    BedNo = vrLastNew.BedNo
                                });
                            }
                        }
                        else
                        {
                            vrLastNew.x = vrLastNew.RN;
                            vrLastNew.low = 0;
                            vrLastNew.high = vrLastNew.y;
                            vrLastNew.color = "#bddaf5"; // gray color
                            lstLastData.Add(vrLastNew);
                        }
                    }

                    List<AMRDataBlockView> listPrevData = new List<AMRDataBlockView>();
                    listPrevData = previous.ToList();
                    foreach (var vrListPrevData in listPrevData)
                    {
                        vrListPrevData.low = vrListPrevData.y;
                        vrListPrevData.high = vrListPrevData.y;
                        vrListPrevData.x = vrListPrevData.RN;
                    }


                    var xCategories = (from lst in last select lst.bId).ToList();

                    data.TotalPowerConsumptionLast = Math.Round((from lst in last select lst.y).Sum(), 2);

                    data.TotalPowerConsumptionPrevious = Math.Round((from prev in previous select prev.y).Sum(), 2);
                    if (data.TotalPowerConsumptionPrevious <= 0)
                    {
                        if (data.TotalPowerConsumptionLast > 0)
                        {
                            data.TotalPowerConsumptionUpgradePercentage = 100.00;
                        }
                        else
                        {
                            data.TotalPowerConsumptionUpgradePercentage = 0.00;
                        }
                    }
                    else
                    {
                        data.TotalPowerConsumptionUpgradePercentage = Math.Round((((data.TotalPowerConsumptionLast -
                                                                     data.TotalPowerConsumptionPrevious) * 100) /
                                                                   data.TotalPowerConsumptionPrevious), 2);
                    }

                    var biggestIncrease = db.Database.SqlQuery<PowerUpgrdateModel>(
                               @";Declare @TempTableDateHours TABLE(
                                  [Date] date,
                                  HourNum int
                                  )
                                  declare @StartDate datetime
                                  declare @EndDate datetime
                                  select @StartDate = '" + _lastStart.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + _lastEnd.ToString("yyyy-MM-dd") + @" 23:59:59'
                                  
                                  while (@StartDate<=@EndDate)
                                  begin
	                                  insert into @TempTableDateHours
	                                  values (@StartDate, DATEPART(Hour, @StartDate))
	                                  select @StartDate=DATEADD(HOUR,1,@StartDate)
                                  end
                                  -- select * from @TempTableDateHours
                                  
                                  Declare @TempTableDateHoursPrev TABLE(
                                  [Date] date,
                                  HourNum int
                                  )
                                  
                                  select @StartDate = '" + _previousStart.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + _previousEnd.ToString("yyyy-MM-dd") + @" 23:59:59'
                                  
                                  while (@StartDate<=@EndDate)
                                  begin
	                                  insert into @TempTableDateHoursPrev
	                                  values (@StartDate, DATEPART(Hour, @StartDate))
	                                  select @StartDate=DATEADD(HOUR,1,@StartDate)
                                  end
                                  
                                  ;with cteLastTempReadData as 
                                  (
	                                  SELECT cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM  (Value),2) as Total
	                                  FROM [dbo].[TempReading]
	                                  where BuildingFkId = " + blockId + @"
	                                  and CAST(Timestamp as date) between '" + _lastStart.ToString("yyyy-MM-dd") + @"' and '" + _lastEnd.ToString("yyyy-MM-dd") + @"'   and ObjectId = 'total'  and   DataFieldId = 'power' 
	                                  group by cast(Timestamp as date), datepart(hour, Timestamp)
                                  ),
                                  cteTempLast as
                                  (
	                                  select ROW_NUMBER() over (order by hrtable.[Date], hrtable.HourNum) as rnT, 
		                                      hrtable.[Date], 
		                                      hrtable.HourNum as bId, 
		                                      ISNULL(cteLastTempReadData.Total, 0) as Total
	                                  from @TempTableDateHours hrtable left outer join cteLastTempReadData
	                                  on hrtable.[Date] = cteLastTempReadData.[Date] and hrtable.HourNum =  cteLastTempReadData.HourNum
	                                  --order by hrtable.HourNum
                                  ),
                                  ctePrevTempReadData as 
                                  (
	                                  SELECT cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM  (Value),2) as Total
	                                  FROM [dbo].[TempReading]
	                                  where BuildingFkId = " + blockId + @"
	                                  and CAST(Timestamp as date) between '" + _previousStart.ToString("yyyy-MM-dd") + @"' and '" + _previousEnd.ToString("yyyy-MM-dd") + @"'   and ObjectId = 'total'  and   DataFieldId = 'power' 
	                                  group by cast(Timestamp as date), datepart(hour, Timestamp)
                                  ),
                                  cteTempPrev as 
                                  (
	                                  select ROW_NUMBER() over (order by hrtable.[Date], hrtable.HourNum) as rnT, 
		                                      hrtable.[Date], 
		                                      hrtable.HourNum as bId, 
		                                      ISNULL(ctePrevTempReadData.Total, 0) as Total
	                                  from @TempTableDateHoursPrev hrtable left outer join ctePrevTempReadData
	                                  on hrtable.[Date] = ctePrevTempReadData.[Date] and hrtable.HourNum =  ctePrevTempReadData.HourNum
                                  )
                                  
                                  -- select * from cteTempLast
                                  -- select * from cteTempPrev
                                  
                                  select top 1 
	                                      dataT.bId as BuildingFkId, 
	                                      convert(varchar(50),dataT.Date, 106) + ' ' + LTRIM(RIGHT(CONVERT(VARCHAR(20), cast((cast  (dataT.bId as nvarchar(50)) + ':00') as datetime), 100), 7)) as BuildingId,
	                                      dataT.TempDifference,
	                                      dataT.DiffPercentage
                                  from
                                  (
	                                  select cteTempLast.*, 
		                                      cast((cteTempLast.Total-cteTempPrev.Total) as decimal(18,2)) as TempDifference,
		                                      case when (cteTempPrev.Total = 0 and cteTempLast.Total>0) then 100.00 when   (cteTempPrev.Total > 0 and cteTempLast.Total<= 0) then 0.00 when (cteTempPrev.Total = 0 and   cteTempLast.Total = 0) then 0.00  else cast(((cteTempLast.Total-cteTempPrev.Total)/  cteTempPrev.Total) as decimal(18,2)) end as DiffPercentage,
		                                      ROW_NUMBER() over (order by ((cteTempLast.Total-cteTempPrev.Total))) as rn 
	                                  from cteTempLast inner join cteTempPrev 
	                                  on cteTempLast.rnT = cteTempPrev.rnT
	                                  where (cteTempLast.Total-cteTempPrev.Total) is not null
                                  ) as dataT
                                  where TempDifference <> 0
                                  order by rn desc").ToList();
                    var biggestDecrease = db.Database.SqlQuery<PowerUpgrdateModel>(
                               @";Declare @TempTableDateHours TABLE(
                                    [Date] date,
                                    HourNum int
                                    )
                                    declare @StartDate datetime
                                    declare @EndDate datetime
                                    select @StartDate = '" + _lastStart.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + _lastEnd.ToString("yyyy-MM-dd") + @" 23:59:59'

                                    while (@StartDate<=@EndDate)
                                    begin
	                                    insert into @TempTableDateHours
	                                    values (@StartDate, DATEPART(Hour, @StartDate))
	                                    select @StartDate=DATEADD(HOUR,1,@StartDate)
                                    end

                                    Declare @TempTableDateHoursPrev TABLE(
                                    [Date] date,
                                    HourNum int
                                    )

                                    select @StartDate = '" + _previousStart.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + _previousEnd.ToString("yyyy-MM-dd") + @" 23:59:59'

                                    while (@StartDate<=@EndDate)
                                    begin
	                                    insert into @TempTableDateHoursPrev
	                                    values (@StartDate, DATEPART(Hour, @StartDate))
	                                    select @StartDate=DATEADD(HOUR,1,@StartDate)
                                    end

                                    ;with cteLastTempReadData as 
                                    (
	                                    SELECT cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM(Value),2) as Total
	                                    FROM [dbo].[TempReading]
	                                    where BuildingFkId = " + blockId + @" 
	                                    and CAST(Timestamp as date) between '" + _lastStart.ToString("yyyy-MM-dd") + @"' and '" + _lastEnd.ToString("yyyy-MM-dd") + @"'  and ObjectId = 'total'  and DataFieldId = 'power' 
	                                    group by cast(Timestamp as date), datepart(hour, Timestamp)
                                    ),
                                    cteTempLast as
                                    (
	                                    select ROW_NUMBER() over (order by hrtable.[Date], hrtable.HourNum) as rnT, 
		                                       hrtable.[Date], 
		                                       hrtable.HourNum as bId, 
		                                       ISNULL(cteLastTempReadData.Total, 0) as Total
	                                    from @TempTableDateHours hrtable left outer join cteLastTempReadData
	                                    on hrtable.[Date] = cteLastTempReadData.[Date] and hrtable.HourNum = cteLastTempReadData.HourNum
                                    ),
                                    ctePrevTempReadData as 
                                    (
	                                    SELECT cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM(Value),2) as Total
	                                    FROM [dbo].[TempReading]
	                                    where BuildingFkId = " + blockId + @" 
	                                    and CAST(Timestamp as date) between '" + _previousStart.ToString("yyyy-MM-dd") + @"' and '" + _previousEnd.ToString("yyyy-MM-dd") + @"'   and ObjectId = 'total'  and DataFieldId = 'power' 
	                                    group by cast(Timestamp as date), datepart(hour, Timestamp)
                                    ),
                                    cteTempPrev as 
                                    (
	                                    select ROW_NUMBER() over (order by hrtable.[Date], hrtable.HourNum) as rnT, 
		                                       hrtable.[Date], 
		                                       hrtable.HourNum as bId, 
		                                       ISNULL(ctePrevTempReadData.Total, 0) as Total
	                                    from @TempTableDateHoursPrev hrtable left outer join ctePrevTempReadData
	                                    on hrtable.[Date] = ctePrevTempReadData.[Date] and hrtable.HourNum = ctePrevTempReadData.HourNum
                                    )

                                    select top 1 
	                                       dataT.bId as BuildingFkId, 
	                                       convert(varchar(50), dataT.Date, 106) + ' ' + LTRIM(RIGHT(CONVERT(VARCHAR(20), cast((cast(dataT.bId as nvarchar(50)) + ':00') as datetime), 100), 7)) as BuildingId,
	                                       dataT.TempDifference,
	                                       dataT.DiffPercentage
                                    from
                                    (
	                                    select cteTempLast.*, 
		                                        cast((cteTempLast.Total-cteTempPrev.Total) as decimal(18,2)) as TempDifference,
		                                        case when (cteTempLast.Total-cteTempPrev.Total)>=0 then 0.00 when (cteTempPrev.Total = 0 and cteTempLast.Total>0) then 0.00 when (cteTempPrev.Total > 0 and cteTempLast.Total = 0) then -100.00 when (cteTempPrev.Total = 0 and cteTempLast.Total = 0) then 0.00  else cast((((cteTempLast.Total-cteTempPrev.Total)*100)/cteTempLast.Total) as decimal(18,2)) end as DiffPercentage,
		                                        ROW_NUMBER() over (order by ((cteTempLast.Total-cteTempPrev.Total))) as rn 
	                                    from cteTempLast inner join cteTempPrev 
	                                    on cteTempLast.rnT = cteTempPrev.rnT
	                                    where (cteTempLast.Total-cteTempPrev.Total) is not null
                                    ) as dataT
                                    where TempDifference <> 0
                                    order by rn").ToList();
                    if (biggestIncrease.Count > 0)
                    {
                        data.BiggestIncreaseLastLabel = biggestIncrease[0].BuildingId;
                        data.BiggestIncreaseLast = biggestIncrease[0].TempDifference;
                        data.BiggestIncreaseUpgradePercentage = biggestIncrease[0].DiffPercentage;
                    }
                    else
                    {
                        data.BiggestIncreaseLastLabel = "";
                        data.BiggestIncreaseLast = 0;
                        data.BiggestIncreaseUpgradePercentage = 0;
                    }

                    if (biggestDecrease.Count > 0)
                    {
                        data.BiggestDecreaseLastLabel = biggestDecrease[0].BuildingId;
                        data.BiggestDecreaseLast = biggestDecrease[0].TempDifference;
                        data.BiggestDecreaseUpgradePercentage = biggestDecrease[0].DiffPercentage;
                    }
                    else
                    {
                        data.BiggestDecreaseLastLabel = "";
                        data.BiggestDecreaseLast = 0;
                        data.BiggestDecreaseUpgradePercentage = 0;
                    }

                    data.Previous = listPrevData;//previous;
                    data.Last = lstLastData;//lastNew.ToList();
                    data.XCategories = xCategories;
                    data.Unit = unit;
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }
            }
            return data;
        }

        public List<AMRDataBlockView> getBlockHourWisePowerData(int blockId, DateTime startDate, DateTime endDate)
        {
            using (var db = new FMCCDataContext())
            {
                try
                {
                    return db.Database.SqlQuery<AMRDataBlockView>(
                        @"Declare @TempTableDateHours TABLE(
                          [Date] date,
                          HourNum int
                          )
                          declare @StartDate datetime
                          declare @EndDate datetime
                          select @StartDate = '" + startDate.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + endDate.ToString("yyyy-MM-dd") + @" 23:59:59'
                          
                          while (@StartDate<=@EndDate)
                          begin
	                          insert into @TempTableDateHours
	                          values (@StartDate, DATEPART(Hour, @StartDate) )
	                          select @StartDate=DATEADD(HOUR,1,@StartDate)
                          end
                          -- select * from @TempTableDateHours
                          
                          ;with cteTempReadData as 
                          (
                          SELECT cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM  (Value),2) as Total
                          FROM [dbo].[TempReading]
                          where BuildingFkId = " + blockId + @"
                          and CAST(Timestamp as date) between '" + startDate.ToString("yyyy-MM-dd") + @"' and '" + endDate.ToString("yyyy-MM-dd") + @"'    
                          and ObjectId = 'total'  and DataFieldId = 'power'   
                          group by cast(Timestamp as date), datepart(hour, Timestamp)
                          )
                          
                          select ROW_NUMBER() over(order by hrtable.[Date], hrtable.HourNum) as RN, (cast((datepart(year,hrtable.[Date])) as nvarchar(10))+'-'+cast((datepart(month,hrtable.[Date])) as nvarchar(10))+'-'+cast((datepart(day,hrtable.[Date])) as nvarchar(10))+'T'+cast  (hrtable.HourNum as varchar(10))+':00:00Z') as bId, 
	                             ISNULL(cteTempReadData.Total, 0) as y,
                                 '#bddaf5' as color,
	                             (select GFA from Building where Building.Id = " + blockId + @") as GFA,
	                             (select BedNo from Building where Building.Id = " + blockId + @") as BedNo
                          from @TempTableDateHours hrtable left outer join cteTempReadData
                          on hrtable.[Date] = cteTempReadData.[Date] and hrtable.HourNum = cteTempReadData.HourNum
                          order by hrtable.[Date], hrtable.HourNum").ToList();
                }
                catch
                {
                    return null;
                }
            }
        }

        [Route("api/report/GetAMRPowerBill/{blockId}/{datafield}/{previousStart}/{previousEnd}/{lastStart}/{lastEnd}/{siteId}/{buildingType}")]
        public AMRPowerConsumptionReportModel GetAMRPowerBill(int blockId, string datafield, string previousStart, string previousEnd, string lastStart, string lastEnd, int siteId, int buildingType)
        {
            DateTime _previousStart;
            DateTime _previousEnd;
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(previousStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousStart);
            DateTime.TryParseExact(previousEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousEnd);
            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            int dateDiff = (_lastEnd - _lastStart).Days;

            AMRPowerConsumptionReportModel data = new AMRPowerConsumptionReportModel();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var unit = ""; //db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == datafield).UnitName;
                    var xPreCategories = (from bldg in db.Buildings
                                          where bldg.Type == buildingType
                                          select new { bldg.Id, bldg.ShortName, bldg.Type }).ToList();
                    decimal tariffRate = 0;

                    var last = getBlockWiseBillData(blockId, _lastStart, _lastEnd, buildingType);
                    var previous = getBlockWiseBillData(blockId, _previousStart, _previousEnd, buildingType);

                    var xCategories = (from bldg in xPreCategories
                                       join lstData in last on bldg.Id equals lstData.bId
                                       where bldg.Type == buildingType
                                       group bldg by new { BuildingFkId = bldg.Id, bldg.ShortName, lstData.y } into g
                                       orderby g.Key.y descending
                                       select g.Key.ShortName).ToList();

                    var lastNew = (from lst in last
                                   join prv in previous on lst.bId equals prv.bId
                                   select new AMRPowerData
                                   {
                                       bId = lst.bId,
                                       y = lst.y,
                                       color = lst.y > prv.y ? "#e74c3c" : lst.y < prv.y ? "#2ecc71" : "#bddaf5",
                                       GFA = lst.GFA,
                                       BedNo = lst.BedNo,
                                       x = lst.bId,
                                       low = 0,
                                       high = lst.y,
                                       prevY = prv.y
                                   }
                                ).OrderByDescending(l => l.y);

                    var prevNew = (from prv in previous
                                   join lst in lastNew on prv.bId equals lst.bId
                                   orderby lst.y descending
                                   select new AMRPowerData
                                   {
                                       bId = prv.bId,
                                       y = prv.y,
                                       color = "#f7a35c",
                                       GFA = prv.GFA,
                                       BedNo = prv.BedNo,
                                       x = prv.bId,
                                       low = prv.y,
                                       high = prv.y,
                                       prevY = prv.y
                                   }
                                );

                    data.TotalPowerConsumptionLast = Math.Round((from lst in last select lst.y).Sum(), 2);

                    data.LastPeak = Math.Round((from lst in last select lst.y).Max(), 2);
                    data.LastAverage = Math.Round((from lst in last select lst.y).Average(), 2);

                    data.TotalPowerConsumptionPrevious = Math.Round((from prev in previous select prev.y).Sum(), 2);
                    if (data.TotalPowerConsumptionPrevious <= 0)
                    {
                        if (data.TotalPowerConsumptionLast > 0)
                        {
                            data.TotalPowerConsumptionUpgradePercentage = 100.00;
                        }
                        else
                        {
                            data.TotalPowerConsumptionUpgradePercentage = 0.00;
                        }
                    }
                    else
                    {
                        data.TotalPowerConsumptionUpgradePercentage = Math.Round((((data.TotalPowerConsumptionLast -
                                                                     data.TotalPowerConsumptionPrevious) * 100) /
                                                                   data.TotalPowerConsumptionPrevious), 2);
                    }

                    var biggestIncrease = db.Database.SqlQuery<PowerUpgrdateModel>(
                               @";with cteTempLast as
                                  (
                                    SELECT bldg.Id as BuildingFkId, 
                                    ShortName as BuildingId, 
                                    isnull(
	                                       (
		                                       select round(sum(DataT.Value),2)
		                                       from
		                                       (
				                                    select isnull(
						                                    (
							                                    (isnull(tr.Value,0))*
							                                    isnull((
										                                    select top 1 PowerMonthlyTariff.Tariff 
										                                    from PowerMonthlyTariff 
										                                    where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                                    and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)),1))
						                                    ,0) as Value
				                                    from TempReading tr
				                                    where cast(tr.Timestamp as date) between '" + _lastStart.ToString("yyyy-MM-dd") + @"' and '" + _lastEnd.ToString("yyyy-MM-dd") + @"' 
				                                    and tr.ObjectId = 'total' and tr.DataFieldId = 'power'
				                                    and tr.BuildingFkId = bldg.Id
		                                       ) as DataT
	                                ),0) as Total
                                    FROM dbo.Building bldg
                                    where bldg.Type = " + buildingType + @" 
                                    group by bldg.Id, ShortName
                                  ),
                                  cteTempPrev as 
                                  (
                                    SELECT bldg.Id as BuildingFkId, 
                                    ShortName as BuildingId, 
                                    isnull(
	                                   (
		                                   select round(sum(DataT.Value),2)
		                                   from
		                                   (
				                                select isnull(
						                                (
							                                (isnull(tr.Value,0))*
							                                isnull((
										                                select top 1 PowerMonthlyTariff.Tariff 
										                                from PowerMonthlyTariff 
										                                where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                                and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)),1))
						                                ,0) as Value
				                                from TempReading tr
				                                where cast(tr.Timestamp as date) between '" + _previousStart.ToString("yyyy-MM-dd") + @"' and '" + _previousEnd.ToString("yyyy-MM-dd") + @"'
				                                and tr.ObjectId = 'total' and tr.DataFieldId = 'power'
				                                and tr.BuildingFkId = bldg.Id
		                                   ) as DataT
	                                ),0) as Total
                                    FROM dbo.Building bldg
                                    where bldg.Type = " + buildingType + @" 
                                    group by bldg.Id, ShortName
                                  )
                                  select top 1 
	                                     dataT.BuildingFkId, 
	                                     dataT.BuildingId,
	                                     dataT.TempDifference,
	                                     dataT.DiffPercentage
                                  from
                                  (
	                                  select cteTempLast.*, 
		                                     cast((cteTempLast.Total-cteTempPrev.Total) as decimal(18,2)) as TempDifference,
		                                     case when (cteTempPrev.Total = 0 and cteTempLast.Total>0) then 100.00 when (cteTempPrev.Total > 0 and cteTempLast.Total<= 0) then 0.00 when (cteTempPrev.Total = 0 and cteTempLast.Total = 0) then 0.00  else cast(((cteTempLast.Total-cteTempPrev.Total)/cteTempPrev.Total) as decimal(18,2)) end as DiffPercentage,
		                                     ROW_NUMBER() over (order by ((cteTempLast.Total-cteTempPrev.Total))) as rn 
	                                  from cteTempLast inner join cteTempPrev 
	                                  on cteTempLast.BuildingFkId = cteTempPrev.BuildingFkId
	                                  and cteTempLast.BuildingId = cteTempPrev.BuildingId
	                                  where (cteTempLast.Total-cteTempPrev.Total) is not null
                                  ) as dataT
                                  where TempDifference <> 0
                                  order by rn desc").ToList();
                    var biggestDecrease = db.Database.SqlQuery<PowerUpgrdateModel>(
                               @";with cteTempLast as
                                  (
                                     SELECT bldg.Id as BuildingFkId, 
                                     ShortName as BuildingId, 
                                     isnull(
	                                       (
		                                       select round(sum(DataT.Value),2)
		                                       from
		                                       (
				                                    select isnull(
						                                    (
							                                    (isnull(tr.Value,0))*
							                                    isnull((
										                                    select top 1 PowerMonthlyTariff.Tariff 
										                                    from PowerMonthlyTariff 
										                                    where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                                    and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)),1))
						                                    ,0) as Value
				                                    from TempReading tr
				                                    where cast(tr.Timestamp as date) between '" + _lastStart.ToString("yyyy-MM-dd") + @"' and '" + _lastEnd.ToString("yyyy-MM-dd") + @"' 
				                                    and tr.ObjectId = 'total' and tr.DataFieldId = 'power'
				                                    and tr.BuildingFkId = bldg.Id
		                                       ) as DataT
	                                ),0) as Total
                                     FROM dbo.Building bldg
                                     where bldg.Type = " + buildingType + @"  
                                     group by bldg.Id, ShortName 
                                  ),
                                  cteTempPrev as 
                                  (
                                     SELECT bldg.Id as BuildingFkId, 
                                     ShortName as BuildingId, 
                                     isnull(
	                                   (
		                                   select round(sum(DataT.Value),2)
		                                   from
		                                   (
				                                select isnull(
						                                (
							                                (isnull(tr.Value,0))*
							                                isnull((
										                                select top 1 PowerMonthlyTariff.Tariff 
										                                from PowerMonthlyTariff 
										                                where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                                and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)),1))
						                                ,0) as Value
				                                from TempReading tr
				                                where cast(tr.Timestamp as date) between '" + _previousStart.ToString("yyyy-MM-dd") + @"' and '" + _previousEnd.ToString("yyyy-MM-dd") + @"'
				                                and tr.ObjectId = 'total' and tr.DataFieldId = 'power'
				                                and tr.BuildingFkId = bldg.Id
		                                   ) as DataT
	                                ),0) as Total
                                     FROM dbo.Building bldg
                                     where bldg.Type = " + buildingType + @"  
                                     group by bldg.Id, ShortName
                                  )
                                  select top 1 
	                                     dataT.BuildingFkId, 
	                                     dataT.BuildingId,
	                                     dataT.TempDifference,
	                                     dataT.DiffPercentage
                                  from
                                  (
	                                  select cteTempLast.*, 
		                                     cast((cteTempLast.Total-cteTempPrev.Total) as decimal(18,2)) as TempDifference,
		                                     case when (cteTempLast.Total-cteTempPrev.Total)>=0 then 0.00 when (cteTempPrev.Total = 0 and cteTempLast.Total>0) then 0.00 when (cteTempPrev.Total > 0 and cteTempLast.Total = 0) then -100.00 when (cteTempPrev.Total = 0 and cteTempLast.Total = 0) then 0.00  else cast((((cteTempLast.Total-cteTempPrev.Total)*100)/cteTempLast.Total) as decimal(18,2)) end as DiffPercentage,
		                                     ROW_NUMBER() over (order by ((cteTempLast.Total-cteTempPrev.Total))) as rn 
	                                  from cteTempLast inner join cteTempPrev 
	                                  on cteTempLast.BuildingFkId = cteTempPrev.BuildingFkId
	                                  and cteTempLast.BuildingId = cteTempPrev.BuildingId
	                                  where (cteTempLast.Total-cteTempPrev.Total) is not null
                                  ) as dataT
                                  where TempDifference <> 0
                                  order by rn").ToList();
                    if (biggestIncrease.Count > 0)
                    {
                        data.BiggestIncreaseLastLabel = biggestIncrease[0].BuildingId;
                        data.BiggestIncreaseLast = biggestIncrease[0].TempDifference;
                        data.BiggestIncreaseUpgradePercentage = biggestIncrease[0].DiffPercentage;
                    }
                    else
                    {
                        data.BiggestIncreaseLastLabel = "";
                        data.BiggestIncreaseLast = 0;
                        data.BiggestIncreaseUpgradePercentage = 0;
                    }

                    if (biggestDecrease.Count > 0)
                    {
                        data.BiggestDecreaseLastLabel = biggestDecrease[0].BuildingId;
                        data.BiggestDecreaseLast = biggestDecrease[0].TempDifference;
                        data.BiggestDecreaseUpgradePercentage = biggestDecrease[0].DiffPercentage;
                    }
                    else
                    {
                        data.BiggestDecreaseLastLabel = "";
                        data.BiggestDecreaseLast = 0;
                        data.BiggestDecreaseUpgradePercentage = 0;
                    }

                    List<AMRPowerData> lstLastDataTemp = new List<AMRPowerData>();
                    lstLastDataTemp = lastNew.ToList();
                    List<AMRPowerData> lstLastData = new List<AMRPowerData>();
                    int xCount = -1;
                    foreach (var vrLastNew in lstLastDataTemp)
                    {
                        xCount++;
                        if (vrLastNew.y > vrLastNew.prevY)
                        {
                            vrLastNew.x = xCount;
                            vrLastNew.low = 0;
                            vrLastNew.high = vrLastNew.prevY;
                            vrLastNew.color = "#bddaf5"; // normal color prev when was equal
                            lstLastData.Add(vrLastNew);

                            lstLastData.Add(new AMRPowerData()
                            {
                                x = xCount,
                                low = vrLastNew.prevY,
                                high = vrLastNew.y,
                                bId = vrLastNew.bId,
                                y = vrLastNew.y,
                                prevY = vrLastNew.y,
                                color = "#FFFF00",//"#e74c3c",
                                GFA = vrLastNew.GFA,
                                BedNo = vrLastNew.BedNo
                            });
                        }
                        else
                        {
                            vrLastNew.x = xCount;
                            vrLastNew.low = 0;
                            vrLastNew.high = vrLastNew.y;
                            vrLastNew.color = "#bddaf5"; // green color
                            lstLastData.Add(vrLastNew);
                        }
                    }

                    List<AMRPowerData> listPrevData = new List<AMRPowerData>();
                    listPrevData = prevNew.ToList();
                    xCount = -1;
                    foreach (var vrListPrevData in listPrevData)
                    {
                        xCount++;
                        vrListPrevData.low = vrListPrevData.y;
                        vrListPrevData.high = vrListPrevData.y;
                        vrListPrevData.x = xCount;
                    }

                    data.Previous = listPrevData;//prevNew.ToList();
                    data.Last = lstLastData;//lastNew.ToList();
                    data.XCategories = xCategories;
                    data.Unit = unit;
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }
            }
            return data;
        }

        [Route("api/report/GetAMRPowerBillBlockView/{blockId}/{datafield}/{previousStart}/{previousEnd}/{lastStart}/{lastEnd}/{siteId}/{buildingType}")]
        public AMRPowerConsumptionBlockViewReportModel GetAMRPowerBillBlockView(int blockId, string datafield, string previousStart, string previousEnd, string lastStart, string lastEnd, int siteId, int buildingType)
        {
            DateTime _previousStart;
            DateTime _previousEnd;
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(previousStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousStart);
            DateTime.TryParseExact(previousEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousEnd);
            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            int dateDiff = (_lastEnd - _lastStart).Days;

            AMRPowerConsumptionBlockViewReportModel data = new AMRPowerConsumptionBlockViewReportModel();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var unit = "";

                    var last = getBlockHourWiseBillData(blockId, _lastStart, _lastEnd);
                    var previousPrevious = getBlockHourWiseBillData(blockId, _previousStart, _previousEnd);

                    var previous = (from prv in previousPrevious
                                    join lst in last on prv.RN equals lst.RN
                                    select new AMRDataBlockView
                                    {
                                        bId = lst.bId,
                                        y = prv.y,
                                        color = "#f7a35c",
                                        GFA = prv.GFA,
                                        BedNo = prv.BedNo,
                                        RN = prv.RN,
                                        prevY = prv.y
                                    }
                                  ).OrderBy(l => l.RN).ToList();

                    var lastNew = (from lst in last
                                   join prv in previous on lst.RN equals prv.RN
                                   select new AMRDataBlockView
                                   {
                                       bId = lst.bId,
                                       y = lst.y,
                                       color = lst.y > prv.y ? "#e74c3c" : lst.y < prv.y ? "#2ecc71" : "#bddaf5",
                                       GFA = lst.GFA,
                                       BedNo = lst.BedNo,
                                       RN = lst.RN,
                                       prevY = prv.y
                                   }
                                    ).OrderBy(l => l.RN).ToList();

                    var today = DateTime.Today;
                    var month = new DateTime(today.Year, today.Month, 1);
                    var firstDate = month.AddMonths(-6);
                    var lastDate = month.AddDays(-1);
                    //double LastNMonthPeak = (db.TempReadings.Where(tr => tr.Timestamp >= firstDate && tr.Timestamp <= lastDate).Max(tr => tr.Value));
                    // For last peak and average
                    var lastMonthNData = getBlockHourWiseBillData(blockId, firstDate, lastDate);
                    data.LastPeak = Math.Round((from lst in lastMonthNData select lst.y).Max(), 2);
                    //data.LastAverage = Math.Round((from lst in last select lst.y).Average(), 2);
                    data.LastAverage = Math.Round(Convert.ToDouble((from bldg in db.Buildings where bldg.Id == blockId select bldg.ContractCapacity).FirstOrDefault()), 2); // now this is contact capacity

                    List<AMRDataBlockView> lstLastData = new List<AMRDataBlockView>();
                    foreach (var vrLastNew in lastNew)
                    {
                        //if (vrLastNew.y > vrLastNew.prevY)
                        if (vrLastNew.y > data.LastPeak)
                        {
                            vrLastNew.x = vrLastNew.RN;
                            vrLastNew.low = 0;
                            vrLastNew.high = data.LastPeak;//vrLastNew.prevY;
                            vrLastNew.color = "#bddaf5";//FFFF00 new logic yellow color//"#bddaf5"; // normal color prev when was equal
                            lstLastData.Add(vrLastNew);

                            lstLastData.Add(new AMRDataBlockView()
                            {
                                x = vrLastNew.RN,
                                RN = vrLastNew.RN,
                                low = data.LastPeak,//vrLastNew.prevY,
                                high = vrLastNew.y > data.LastAverage ? data.LastAverage : vrLastNew.y,
                                bId = vrLastNew.bId,
                                y = vrLastNew.y,
                                prevY = vrLastNew.y,
                                color = "#FFA500", // "#e74c3c",
                                GFA = vrLastNew.GFA,
                                BedNo = vrLastNew.BedNo
                            });

                            if (vrLastNew.y > data.LastAverage)
                            {
                                lstLastData.Add(new AMRDataBlockView()
                                {
                                    x = vrLastNew.RN,
                                    RN = vrLastNew.RN,
                                    low = data.LastAverage,//vrLastNew.prevY,
                                    high = vrLastNew.y,
                                    bId = vrLastNew.bId,
                                    y = vrLastNew.y,
                                    prevY = vrLastNew.y,
                                    color = "#ff0000", // "#e74c3c",
                                    GFA = vrLastNew.GFA,
                                    BedNo = vrLastNew.BedNo
                                });
                            }
                        }
                        else
                        {
                            vrLastNew.x = vrLastNew.RN;
                            vrLastNew.low = 0;
                            vrLastNew.high = vrLastNew.y;
                            vrLastNew.color = "#bddaf5"; // gray color
                            lstLastData.Add(vrLastNew);
                        }
                    }

                    List<AMRDataBlockView> listPrevData = new List<AMRDataBlockView>();
                    listPrevData = previous.ToList();
                    foreach (var vrListPrevData in listPrevData)
                    {
                        vrListPrevData.low = vrListPrevData.y;
                        vrListPrevData.high = vrListPrevData.y;
                        vrListPrevData.x = vrListPrevData.RN;
                    }

                    var xCategories = (from lst in last select lst.bId).ToList();

                    data.TotalPowerConsumptionLast = Math.Round((from lst in last select lst.y).Sum(), 2);

                    data.TotalPowerConsumptionPrevious = Math.Round((from prev in previous select prev.y).Sum(), 2);
                    if (data.TotalPowerConsumptionPrevious <= 0)
                    {
                        if (data.TotalPowerConsumptionLast > 0)
                        {
                            data.TotalPowerConsumptionUpgradePercentage = 100.00;
                        }
                        else
                        {
                            data.TotalPowerConsumptionUpgradePercentage = 0.00;
                        }
                    }
                    else
                    {
                        data.TotalPowerConsumptionUpgradePercentage = Math.Round((((data.TotalPowerConsumptionLast -
                                                                     data.TotalPowerConsumptionPrevious) * 100) /
                                                                   data.TotalPowerConsumptionPrevious), 2);
                    }

                    var biggestIncrease = db.Database.SqlQuery<PowerUpgrdateModel>(
                               @";Declare @TempTableDateHours TABLE(
                                [Date] date,
                                HourNum int
                                )
                                declare @StartDate datetime
                                declare @EndDate datetime
                                select @StartDate = '" + _lastStart.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + _lastEnd.ToString("yyyy-MM-dd") + @" 23:59:59'

                                while (@StartDate<=@EndDate)
                                begin
	                                insert into @TempTableDateHours
	                                values (@StartDate, DATEPART(Hour, @StartDate))
	                                select @StartDate=DATEADD(HOUR,1,@StartDate)
                                end

                                Declare @TempTableDateHoursPrev TABLE(
                                [Date] date,
                                HourNum int
                                )

                                select @StartDate = '" + _previousStart.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + _previousEnd.ToString("yyyy-MM-dd") + @" 23:59:59'

                                while (@StartDate<=@EndDate)
                                begin
	                                insert into @TempTableDateHoursPrev
	                                values (@StartDate, DATEPART(Hour, @StartDate))
	                                select @StartDate=DATEADD(HOUR,1,@StartDate)
                                end

                                ;with cteLastTempReadData as 
                                (
                                    select cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM(DataT.Value),2) as Total
	                                from
	                                (
		                                SELECT tr.Timestamp, 
			                                    isnull(
					                                (
						                                (isnull(tr.Value,0))*
						                                isnull(
									                                (
										                                select top 1 PowerMonthlyTariff.Tariff 
										                                from PowerMonthlyTariff 
										                                where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                                and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)
									                                ),1)
					                                )
			                                ,0) as Value
		                                FROM [dbo].[TempReading] tr
		                                where BuildingFkId = " + blockId + @"  
		                                and CAST(Timestamp as date) between '" + _lastStart.ToString("yyyy-MM-dd") + @"' and '" + _lastEnd.ToString("yyyy-MM-dd") + @"'  
		                                and ObjectId = 'total'  and DataFieldId = 'power'   
	                                ) as DataT
	                                group by cast(Timestamp as date), datepart(hour, Timestamp)
                                ),
                                cteTempLast as
                                (
	                                select ROW_NUMBER() over (order by hrtable.[Date], hrtable.HourNum) as rnT, 
		                                   hrtable.[Date], 
		                                   hrtable.HourNum as bId, 
		                                   ISNULL(cteLastTempReadData.Total, 0) as Total
	                                from @TempTableDateHours hrtable left outer join cteLastTempReadData
	                                on hrtable.[Date] = cteLastTempReadData.[Date] and hrtable.HourNum = cteLastTempReadData.HourNum
                                ),
                                ctePrevTempReadData as 
                                (
	                                select cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM(DataT.Value),2) as Total
	                                from
	                                (
		                                SELECT tr.Timestamp, 
			                                    isnull(
					                                (
						                                (isnull(tr.Value,0))*
						                                isnull(
									                                (
										                                select top 1 PowerMonthlyTariff.Tariff 
										                                from PowerMonthlyTariff 
										                                where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                                and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)
									                                ),1)
					                                )
			                                ,0) as Value
		                                FROM [dbo].[TempReading] tr
		                                where BuildingFkId = " + blockId + @" 
		                                and CAST(Timestamp as date) between '" + _previousStart.ToString("yyyy-MM-dd") + @"' and '" + _previousEnd.ToString("yyyy-MM-dd") + @"'    
		                                and ObjectId = 'total'  and DataFieldId = 'power'   
	                                ) as DataT
	                                group by cast(Timestamp as date), datepart(hour, Timestamp)
                                ),
                                cteTempPrev as 
                                (
	                                select ROW_NUMBER() over (order by hrtable.[Date], hrtable.HourNum) as rnT, 
		                                   hrtable.[Date], 
		                                   hrtable.HourNum as bId, 
		                                   ISNULL(ctePrevTempReadData.Total, 0) as Total
	                                from @TempTableDateHoursPrev hrtable left outer join ctePrevTempReadData
	                                on hrtable.[Date] = ctePrevTempReadData.[Date] and hrtable.HourNum = ctePrevTempReadData.HourNum
                                )
                                select top 1 
	                                    dataT.bId as BuildingFkId, 
	                                    convert(varchar(50),dataT.Date, 106) + ' ' + LTRIM(RIGHT(CONVERT(VARCHAR(20), cast((cast(dataT.bId as nvarchar(50)) + ':00') as datetime), 100), 7)) as BuildingId,
	                                    dataT.TempDifference,
	                                    dataT.DiffPercentage
                                from
                                (
	                                select cteTempLast.*, 
		                                    cast((cteTempLast.Total-cteTempPrev.Total) as decimal(18,2)) as TempDifference,
		                                    case when (cteTempPrev.Total = 0 and cteTempLast.Total>0) then 100.00 when (cteTempPrev.Total > 0 and cteTempLast.Total<= 0) then 0.00 when (cteTempPrev.Total = 0 and cteTempLast.Total = 0) then 0.00  else cast(((cteTempLast.Total-cteTempPrev.Total)/cteTempPrev.Total) as decimal(18,2)) end as DiffPercentage,
		                                    ROW_NUMBER() over (order by ((cteTempLast.Total-cteTempPrev.Total))) as rn 
	                                from cteTempLast inner join cteTempPrev 
	                                on cteTempLast.rnT = cteTempPrev.rnT
	                                where (cteTempLast.Total-cteTempPrev.Total) is not null
                                ) as dataT
                                where TempDifference <> 0
                                order by rn desc").ToList();
                    var biggestDecrease = db.Database.SqlQuery<PowerUpgrdateModel>(
                               @";Declare @TempTableDateHours TABLE(
	                                    [Date] date,
	                                    HourNum int
                                    )
                                    declare @StartDate datetime
                                    declare @EndDate datetime
                                    select @StartDate = '" + _lastStart.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + _lastEnd.ToString("yyyy-MM-dd") + @" 23:59:59'

                                    while (@StartDate<=@EndDate)
                                    begin
	                                    insert into @TempTableDateHours
	                                    values (@StartDate, DATEPART(Hour, @StartDate))
	                                    select @StartDate=DATEADD(HOUR,1,@StartDate)
                                    end

                                    Declare @TempTableDateHoursPrev TABLE(
	                                    [Date] date,
	                                    HourNum int
                                    )

                                    select @StartDate = '" + _previousStart.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + _previousEnd.ToString("yyyy-MM-dd") + @" 23:59:59'
                                    while (@StartDate<=@EndDate)
                                    begin
	                                    insert into @TempTableDateHoursPrev
	                                    values (@StartDate, DATEPART(Hour, @StartDate))
	                                    select @StartDate=DATEADD(HOUR,1,@StartDate)
                                    end



                                    ;with cteLastTempReadData as 
                                    (
	                                    select cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM(DataT.Value),2) as Total
	                                    from
	                                    (
		                                    SELECT tr.Timestamp, 
			                                        isnull(
					                                    (
						                                    (isnull(tr.Value,0))*
						                                    isnull(
									                                    (
										                                    select top 1 PowerMonthlyTariff.Tariff 
										                                    from PowerMonthlyTariff 
										                                    where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                                    and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)
									                                    ),1)
					                                    )
			                                    ,0) as Value
		                                    FROM [dbo].[TempReading] tr
		                                    where BuildingFkId = " + blockId + @" 
		                                    and CAST(Timestamp as date) between '" + _lastStart.ToString("yyyy-MM-dd") + @"' and '" + _lastEnd.ToString("yyyy-MM-dd") + @"'  
		                                    and ObjectId = 'total'  and DataFieldId = 'power'   
	                                    ) as DataT
	                                    group by cast(Timestamp as date), datepart(hour, Timestamp)
                                    ),
                                    cteTempLast as
                                    (
	                                    select ROW_NUMBER() over (order by hrtable.[Date], hrtable.HourNum) as rnT, 
		                                       hrtable.[Date], 
		                                       hrtable.HourNum as bId, 
		                                       ISNULL(cteLastTempReadData.Total, 0) as Total
	                                    from @TempTableDateHours hrtable left outer join cteLastTempReadData
	                                    on hrtable.[Date] = cteLastTempReadData.[Date] and hrtable.HourNum = cteLastTempReadData.HourNum
                                    ),
                                    ctePrevTempReadData as 
                                    (
	                                    select cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM(DataT.Value),2) as Total
	                                    from
	                                    (
		                                    SELECT tr.Timestamp, 
			                                        isnull(
					                                    (
						                                    (isnull(tr.Value,0))*
						                                    isnull(
									                                    (
										                                    select top 1 PowerMonthlyTariff.Tariff 
										                                    from PowerMonthlyTariff 
										                                    where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                                    and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)
									                                    ),1)
					                                    )
			                                    ,0) as Value
		                                    FROM [dbo].[TempReading] tr
		                                    where BuildingFkId = " + blockId + @" 
		                                    and CAST(Timestamp as date) between '" + _previousStart.ToString("yyyy-MM-dd") + @"' and '" + _previousEnd.ToString("yyyy-MM-dd") + @"'  
		                                    and ObjectId = 'total'  and DataFieldId = 'power'   
	                                    ) as DataT
	                                    group by cast(Timestamp as date), datepart(hour, Timestamp)
                                    ),
                                    cteTempPrev as 
                                    (
	                                    select ROW_NUMBER() over (order by hrtable.[Date], hrtable.HourNum) as rnT, 
		                                       hrtable.[Date], 
		                                       hrtable.HourNum as bId, 
		                                       ISNULL(ctePrevTempReadData.Total, 0) as Total
	                                    from @TempTableDateHoursPrev hrtable left outer join ctePrevTempReadData
	                                    on hrtable.[Date] = ctePrevTempReadData.[Date] and hrtable.HourNum = ctePrevTempReadData.HourNum
                                    )
                                    select top 1 
	                                        dataT.bId as BuildingFkId, 
	                                        convert(varchar(50),dataT.Date, 106) + ' ' + LTRIM(RIGHT(CONVERT(VARCHAR(20), cast((cast(dataT.bId as nvarchar(50)) + ':00') as datetime), 100), 7)) as BuildingId,
	                                        dataT.TempDifference,
	                                        dataT.DiffPercentage
                                    from
                                    (
	                                    select cteTempLast.*, 
		                                        cast((cteTempLast.Total-cteTempPrev.Total) as decimal(18,2)) as TempDifference,
		                                        case when (cteTempLast.Total-cteTempPrev.Total)>=0 then 0.00 when (cteTempPrev.Total = 0 and cteTempLast.Total>0) then 0.00 when (cteTempPrev.Total > 0 and cteTempLast.Total = 0) then -100.00 when (cteTempPrev.Total = 0 and cteTempLast.Total = 0) then 0.00  else cast((((cteTempLast.Total-cteTempPrev.Total)*100)/cteTempLast.Total) as decimal(18,2)) end as DiffPercentage,
		                                        ROW_NUMBER() over (order by ((cteTempLast.Total-cteTempPrev.Total))) as rn 
	                                    from cteTempLast inner join cteTempPrev 
	                                    on cteTempLast.rnT = cteTempPrev.rnT
	                                    where (cteTempLast.Total-cteTempPrev.Total) is not null
                                    ) as dataT
                                    where TempDifference <> 0
                                    order by rn").ToList();
                    if (biggestIncrease.Count > 0)
                    {
                        data.BiggestIncreaseLastLabel = biggestIncrease[0].BuildingId;
                        data.BiggestIncreaseLast = biggestIncrease[0].TempDifference;
                        data.BiggestIncreaseUpgradePercentage = biggestIncrease[0].DiffPercentage;
                    }
                    else
                    {
                        data.BiggestIncreaseLastLabel = "";
                        data.BiggestIncreaseLast = 0;
                        data.BiggestIncreaseUpgradePercentage = 0;
                    }

                    if (biggestDecrease.Count > 0)
                    {
                        data.BiggestDecreaseLastLabel = biggestDecrease[0].BuildingId;
                        data.BiggestDecreaseLast = biggestDecrease[0].TempDifference;
                        data.BiggestDecreaseUpgradePercentage = biggestDecrease[0].DiffPercentage;
                    }
                    else
                    {
                        data.BiggestDecreaseLastLabel = "";
                        data.BiggestDecreaseLast = 0;
                        data.BiggestDecreaseUpgradePercentage = 0;
                    }

                    data.Previous = listPrevData;//previous;
                    data.Last = lstLastData;//lastNew.ToList();
                    data.XCategories = xCategories;
                    data.Unit = unit;
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }
            }
            return data;
        }

        public List<AMRDataBlockView> getBlockHourWiseBillData(int blockId, DateTime startDate, DateTime endDate)
        {
            using (var db = new FMCCDataContext())
            {
                try
                {
                    return db.Database.SqlQuery<AMRDataBlockView>(
                        @"Declare @TempTableDateHours TABLE(
                          [Date] date,
                          HourNum int
                          )
                          declare @StartDate datetime
                          declare @EndDate datetime
                          select @StartDate = '" + startDate.ToString("yyyy-MM-dd") + @" 00:00:00' ,  @EndDate = '" + endDate.ToString("yyyy-MM-dd") + @" 23:59:59'  

                          while (@StartDate<=@EndDate)
                          begin
                           insert into @TempTableDateHours
                           values (@StartDate, DATEPART(Hour, @StartDate) )
                           select @StartDate=DATEADD(HOUR,1,@StartDate)
                          end
                          -- select * from @TempTableDateHours

                          ;with cteTempReadData as 
                          (
                          select cast(Timestamp as date) as [Date], datepart(hour, Timestamp) as [HourNum], round(SUM(DataT.Value),2) as Total
                          from
                          (
	                          SELECT tr.Timestamp, 
		                              isnull(
				                          (
					                          (isnull(tr.Value,0))*
					                          isnull(
						                            (
							                            select top 1 PowerMonthlyTariff.Tariff 
							                            from PowerMonthlyTariff 
							                            where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
							                            and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)
						                            ),1)
				                          )
		                          ,0) as Value
	                          FROM [dbo].[TempReading] tr
	                          where BuildingFkId = " + blockId + @"
	                          and CAST(Timestamp as date) between '" + startDate.ToString("yyyy-MM-dd") + @"' and '" + endDate.ToString("yyyy-MM-dd") + @"'   
	                          and ObjectId = 'total'  and DataFieldId = 'power'   
                          ) as DataT
                          group by cast(Timestamp as date), datepart(hour, Timestamp)
                          )

                          select ROW_NUMBER() over(order by hrtable.[Date], hrtable.HourNum) as RN,(cast((datepart(year,hrtable.[Date])) as nvarchar(10))+'-'+cast((datepart(month,hrtable.[Date])) as nvarchar(10))+'-'+cast((datepart(day,hrtable.[Date])) as nvarchar(10))+'T'+cast  (hrtable.HourNum as varchar(10))+':00:00Z') as bId, 
                              ISNULL(cteTempReadData.Total, 0) as y,
	                          (select GFA from Building where Building.Id = " + blockId + @") as GFA,
	                          (select BedNo from Building where Building.Id = " + blockId + @") as BedNo
                          from @TempTableDateHours hrtable left outer join cteTempReadData
                          on hrtable.[Date] = cteTempReadData.[Date] and hrtable.HourNum = cteTempReadData.HourNum
                          order by hrtable.[Date], hrtable.HourNum").ToList();
                }
                catch
                {
                    return null;
                }
            }
        }

        public List<AMRPowerData> getBlockWiseBillData(int blockId, DateTime startDate, DateTime endDate, int buildingType)
        {
            using (var db = new FMCCDataContext())
            {
                try
                {
                    return db.Database.SqlQuery<AMRPowerData>(
                        @"select bldg.Id as bId, 
	                           isnull(
	                           (
		                           select round(sum(DataT.Value),2)
		                           from
		                           (
				                        select isnull(
						                        (
							                        (isnull(tr.Value,0))*
							                        isnull((
										                        select top 1 PowerMonthlyTariff.Tariff 
										                        from PowerMonthlyTariff 
										                        where datepart(YEAR, PowerMonthlyTariff.MonthDateTime) = datepart(YEAR, tr.Timestamp) 
										                        and datepart(MONTH, PowerMonthlyTariff.MonthDateTime) = datepart(MONTH, tr.Timestamp)),1))
						                        ,0) as Value
				                        from TempReading tr
				                        where cast(tr.Timestamp as date) between '" + startDate.ToString("yyyy-MM-dd") + @"' and '" + endDate.ToString("yyyy-MM-dd") + @"' 
                                        and tr.ObjectId = 'total' and tr.DataFieldId = 'power' 
				                        and tr.BuildingFkId = bldg.Id
		                           ) as DataT
	                           ),0) as y,
                               '#bddaf5' as color,
		                        GFA,
		                        BedNo
                        from dbo.Building bldg  
                        where bldg.Type = " + buildingType + @"
                        group by bldg.Id, bldg.BuildingId, GFA, BedNo
                        order by y desc").ToList();
                }
                catch
                {
                    return null;
                }
            }
        }

        [Route("api/report/powerconsumption/{blockId}/{datafield}/{previousStart}/{previousEnd}/{lastStart}/{lastEnd}/{siteId}")]
        public PowerConsumptionReportModel GetPowerConsumption(int blockId, string datafield, string previousStart, string previousEnd, string lastStart, string lastEnd, int siteId)
        {
            DateTime _previousStart;
            DateTime _previousEnd;
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(previousStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousStart);
            DateTime.TryParseExact(previousEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _previousEnd);
            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            int dateDiff = (_lastEnd - _lastStart).Days;

            PowerConsumptionReportModel data = new PowerConsumptionReportModel();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == datafield).UnitName;

                    if (blockId == -1)
                    {
                        if (dateDiff == 6)
                        {
                            var previous = (from r in db.TempReadings
                                            join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                            join b in db.Buildings on d.BuildingFkId equals b.Id
                                            where d.DataFieldUnit == unit
                                            && r.Timestamp >= _previousStart
                                            && r.Timestamp <= _previousEnd
                                            && b.SiteId == siteId
                                            group r by SqlFunctions.DatePart("weekday", r.Timestamp) into g
                                            select new DayData
                                            {
                                                Day = g.Key,
                                                Value = Math.Round(g.Sum(l => l.Value), 2)
                                            }).OrderBy(l => l.Day).ToList();

                            var last = (from r in db.TempReadings
                                        join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                        where d.DataFieldUnit == unit
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by SqlFunctions.DatePart("weekday", r.Timestamp) into g
                                        select new DayData
                                        {
                                            Day = g.Key,
                                            Value = Math.Round(g.Sum(l => l.Value), 2)
                                        }).OrderBy(l => l.Day).ToList();

                            data.Previous = previous;
                            data.Last = last;
                            data.Unit = unit;

                        }
                        else
                        {
                            var previous = (from r in db.TempReadings
                                            join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                            where d.DataFieldUnit == unit
                                            && r.Timestamp >= _previousStart
                                            && r.Timestamp <= _previousEnd
                                            group r by r.Timestamp.Day into g
                                            select new DayData
                                            {
                                                Day = g.Key,
                                                Value = Math.Round(g.Sum(l => l.Value), 2)
                                            }).OrderBy(l => l.Day).ToList();

                            var last = (from r in db.TempReadings
                                        join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                        where d.DataFieldUnit == unit
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.Timestamp.Day into g
                                        select new DayData
                                        {
                                            Day = g.Key,
                                            Value = Math.Round(g.Sum(l => l.Value), 2)
                                        }).OrderBy(l => l.Day).ToList();

                            data.Previous = previous;
                            data.Last = last;
                            data.Unit = unit;

                        }
                    }
                    else
                    {
                        if (dateDiff == 6)
                        {
                            var previous = (from r in db.TempReadings
                                            join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                            where d.DataFieldUnit == unit
                                            && r.BuildingFkId == blockId
                                            && r.Timestamp >= _previousStart
                                            && r.Timestamp <= _previousEnd
                                            group r by SqlFunctions.DatePart("weekday", r.Timestamp) into g
                                            select new DayData
                                            {
                                                Day = g.Key,
                                                Value = Math.Round(g.Sum(l => l.Value), 2)
                                            }).OrderBy(l => l.Day).ToList();

                            var last = (from r in db.TempReadings
                                        join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                        where d.DataFieldUnit == unit
                                        && r.BuildingFkId == blockId
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by SqlFunctions.DatePart("weekday", r.Timestamp) into g
                                        select new DayData
                                        {
                                            Day = g.Key,
                                            Value = Math.Round(g.Sum(l => l.Value), 2)
                                        }).OrderBy(l => l.Day).ToList();

                            data.Previous = previous;
                            data.Last = last;
                            data.Unit = unit;

                        }
                        else
                        {

                            var previous = (from r in db.TempReadings
                                            join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                            where d.DataFieldUnit == unit
                                            && r.BuildingFkId == blockId
                                            && r.Timestamp >= _previousStart
                                            && r.Timestamp <= _previousEnd
                                            group r by r.Timestamp.Day into g
                                            select new DayData
                                            {
                                                Day = g.Key,
                                                Value = Math.Round(g.Sum(l => l.Value), 2)
                                            }).OrderBy(l => l.Day).ToList();

                            var last = (from r in db.TempReadings
                                        join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                        where d.DataFieldUnit == unit
                                        && r.BuildingFkId == blockId
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.Timestamp.Day into g
                                        select new DayData
                                        {
                                            Day = g.Key,
                                            Value = Math.Round(g.Sum(l => l.Value), 2)
                                        }).OrderBy(l => l.Day).ToList();

                            data.Previous = previous;
                            data.Last = last;
                            data.Unit = unit;

                        }
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            return data;
        }

        [Route("api/report/pcbd/{blockId}/{datafield}/{lastStart}/{lastEnd}/{siteId}")]
        public List<BlockData> GetPowerConsumptionBreakDown(int blockId, string datafield, string lastStart, string lastEnd, int siteId)
        {
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            List<BlockData> data = new List<BlockData>();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == datafield).UnitName;

                    if (blockId == -1)
                    {
                        data = (from r in db.TempReadings
                                join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                join b in db.Buildings on d.BuildingFkId equals b.Id
                                where d.DataFieldUnit == unit
                                && r.Timestamp >= _lastStart
                                && r.Timestamp <= _lastEnd
                                && b.SiteId == siteId
                                group r by r.BuildingFkId into g
                                select new BlockData
                                {
                                    Block = db.Buildings.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                    Value = Math.Round(g.Sum(l => l.Value), 2),
                                    Unit = unit
                                }).ToList();

                    }
                    else
                    {
                        data = (from r in db.TempReadings
                                join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                where d.DataFieldUnit == unit
                                && r.BuildingFkId == blockId
                                && r.Timestamp >= _lastStart
                                && r.Timestamp <= _lastEnd
                                group r by r.BuildingFkId into g
                                select new BlockData
                                {
                                    Block = db.Buildings.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                    Value = Math.Round(g.Sum(l => l.Value), 2),
                                    Unit = unit
                                }).ToList();
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            return data;
        }

        [Route("api/report/pcrdd/{blockId}/{datafield}/{lastStart}/{lastEnd}/{siteId}")]
        public PowerConsumptionReportDashboardDataDTO GetPowerConsumptionReportDashBoardData(int blockId, string datafield, string lastStart, string lastEnd, int siteId)
        {
            DateTime _lastStart;
            DateTime _lastEnd;
            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            PowerConsumptionReportDashboardDataDTO data = new PowerConsumptionReportDashboardDataDTO();

            using (var db = new FMCCDataContext())
            {

                try
                {
                    var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == datafield).UnitName;

                    if (blockId == -1)
                    {
                        var reading = from r in db.TempReadings
                                      join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                      join b in db.Buildings on d.BuildingFkId equals b.Id
                                      where d.DataFieldUnit == unit
                                      && r.Timestamp >= _lastStart
                                      && r.Timestamp <= _lastEnd
                                      && b.SiteId == siteId
                                      group r by r.BuildingFkId into g
                                      select new
                                      {
                                          BlockName = db.Buildings.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                          Sum = g.Sum(l => l.Value)
                                      };

                        data.TotalValue = (int)Math.Round(reading.Sum(a => a.Sum), 0);
                        data.LowestBlockName = reading.OrderBy(l => l.Sum).Select(l => l.BlockName).FirstOrDefault();
                        data.LowestBlockValue = (int)Math.Round(reading.OrderBy(l => l.Sum).Select(l => l.Sum).FirstOrDefault(), 0);
                        data.HighestBlockName = reading.OrderByDescending(l => l.Sum).Select(l => l.BlockName).FirstOrDefault();
                        data.HighestBlockValue = (int)Math.Round(reading.OrderByDescending(l => l.Sum).Select(l => l.Sum).FirstOrDefault(), 0);
                        data.Unit = unit;
                    }
                    else
                    {
                        var reading = from r in db.TempReadings
                                      join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                      where d.DataFieldUnit == unit
                                      && r.BuildingFkId == blockId
                                      && r.Timestamp >= _lastStart
                                      && r.Timestamp <= _lastEnd
                                      select r;
                        string blockName = db.Buildings.Where(a => a.Id == blockId).Select(a => a.Name).FirstOrDefault();
                        double sum = (int)Math.Round(reading.Sum(a => a.Value), 0);

                        data.TotalValue = sum;
                        data.LowestBlockName = blockName;
                        data.LowestBlockValue = sum;
                        data.HighestBlockName = blockName;
                        data.HighestBlockValue = sum;
                        data.Unit = unit;

                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            return data;
        }

        [Route("api/report/alert/{blockId}/{datafield}/{lastStart}/{lastEnd}/{type}/{siteId}")]
        public List<AlertDTO> GetAlert(int blockId, string datafield, string lastStart, string lastEnd, int type, int siteId)
        {
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            List<AlertDTO> data = new List<AlertDTO>();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == datafield).UnitName;

                    if (blockId == -1)
                    {
                        data = (from r in db.Alerts
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                join b in db.Buildings on ars.BuildingFkId equals b.Id
                                where r.FromDateTime >= _lastStart
                                && r.FromDateTime <= _lastEnd
                                && r.Type == type
                                && b.SiteId == siteId
                                orderby r.FromDateTime descending
                                select new
                                 {
                                     Block = r.BuildingId,
                                     Title = ars.AlertText,
                                     DataField = r.DataFieldId,
                                     Severity = r.Severity,
                                     Timestamp = r.FromDateTime,
                                     Condition = r.AlertCondition,
                                     ReferenceValue = r.ReferenceValue,
                                     Status = r.FMCCStatus
                                 }).ToList()
                                .Select(l => new AlertDTO
                                {
                                    Block = l.Block,
                                    Title = l.Title,
                                    DataField = l.DataField,
                                    Severity = l.Severity,
                                    Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                    Condition = l.Condition,
                                    ReferenceValue = l.ReferenceValue,
                                    Status = l.Status
                                }).ToList();
                    }
                    else
                    {
                        data = (from r in db.Alerts
                                join b in db.Buildings on r.BuildingFkId equals b.Id
                                join d in db.DataFields on r.DataFieldFkId equals d.Id
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                join bd in db.BuildingObjectDatas on r.DataFieldFkId equals bd.DataFieldFkId
                                where bd.DataFieldUnit == unit
                                    && r.BuildingFkId == blockId
                                    && r.FromDateTime >= _lastStart
                                    && r.FromDateTime <= _lastEnd
                                orderby r.FromDateTime
                                select new
                                     {
                                         Block = b.Name,
                                         Title = ars.AlertText,
                                         DataField = d.Name,
                                         Severity = r.Severity,
                                         Timestamp = r.FromDateTime,
                                         Condition = r.AlertCondition,
                                         ReferenceValue = r.ReferenceValue,
                                         Status = r.FMCCStatus
                                     }).ToList()
                                    .Select(l => new AlertDTO
                                    {
                                        Block = l.Block,
                                        Title = l.Title,
                                        DataField = l.DataField,
                                        Severity = l.Severity,
                                        Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                        Condition = l.Condition,
                                        ReferenceValue = l.ReferenceValue,
                                        Status = l.Status
                                    }).ToList();
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            return data;
        }

        [System.Web.Http.HttpGet]
        [Route("api/report/alertWithPaging")]
        public object GetAlertWithPaging()
        {
            int start = 0;
            int length = 10;
            string datafield = "";
            int alertType = 0;
            DateTime _lastStart = DateTime.MinValue;
            DateTime _lastEnd = DateTime.MinValue;
            int siteId = 1;
            int blockId = -1;
            var queryString = Request.GetQueryNameValuePairs()
                .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
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
            if (queryString.ContainsKey("alertType"))
            {
                if (!string.IsNullOrEmpty(queryString["alertType"]))
                {
                    alertType = Convert.ToInt32(queryString["alertType"]);
                }
            }
            if (queryString.ContainsKey("datafield"))
            {
                if (!string.IsNullOrEmpty(queryString["datafield"]))
                {
                    datafield = queryString["datafield"];
                }
            }

            if (queryString.ContainsKey("length"))
            {
                if (!string.IsNullOrEmpty(queryString["length"]))
                {
                    length = Convert.ToInt32(queryString["length"]);
                }
            }

            if (queryString.ContainsKey("block"))
            {
                if (!string.IsNullOrEmpty(queryString["block"]))
                {
                    blockId = Convert.ToInt32(queryString["block"]);
                }
            }

            if (queryString.ContainsKey("startDate"))
            {
                if (!string.IsNullOrEmpty(queryString["startDate"]))
                {
                    DateTime.TryParseExact(queryString["startDate"], "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);

                }
            }

            if (queryString.ContainsKey("endDate"))
            {
                if (!string.IsNullOrEmpty(queryString["endDate"]))
                {
                    DateTime.TryParseExact(queryString["endDate"], "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

                }
            }

            List<AlertDTO> data = new List<AlertDTO>();
            int totalRecordCount = 0;

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == datafield).UnitName;

                    if (blockId == -1)
                    {
                        totalRecordCount = (from r in db.Alerts
                                            join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                            join b in db.Buildings on ars.BuildingFkId equals b.Id
                                            where r.FromDateTime >= _lastStart
                                                  && r.FromDateTime <= _lastEnd
                                                  && r.Type == alertType
                                                  && b.SiteId == siteId
                                            select new
                                            {
                                                Block = r.BuildingId,
                                                Title = ars.AlertText,
                                                DataField = r.DataFieldId,
                                                Severity = r.Severity,
                                                Timestamp = r.FromDateTime,
                                                Condition = r.AlertCondition,
                                                ReferenceValue = r.ReferenceValue,
                                                Status = r.FMCCStatus
                                            }).Count();

                        data = (from r in db.Alerts
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                join b in db.Buildings on ars.BuildingFkId equals b.Id
                                where r.FromDateTime >= _lastStart
                                && r.FromDateTime <= _lastEnd
                                && r.Type == alertType
                                && b.SiteId == siteId
                                orderby r.FromDateTime descending
                                select new
                                {
                                    Block = r.BuildingId,
                                    Title = ars.AlertText,
                                    DataField = r.DataFieldId,
                                    Severity = r.Severity,
                                    Timestamp = r.FromDateTime,
                                    Condition = r.AlertCondition,
                                    ReferenceValue = r.ReferenceValue,
                                    Status = r.FMCCStatus
                                }).Skip(start).Take(length).ToList()
                                .Select(l => new AlertDTO
                                {
                                    Block = l.Block,
                                    Title = l.Title,
                                    DataField = l.DataField,
                                    Severity = l.Severity,
                                    Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                    Condition = l.Condition,
                                    ReferenceValue = l.ReferenceValue,
                                    Status = l.Status
                                }).ToList();
                    }
                    else
                    {
                        totalRecordCount = (from r in db.Alerts
                                            join b in db.Buildings on r.BuildingFkId equals b.Id
                                            join d in db.DataFields on r.DataFieldFkId equals d.Id
                                            join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                            join bd in db.BuildingObjectDatas on r.DataFieldFkId equals bd.DataFieldFkId
                                            where bd.DataFieldUnit == unit
                                                  && r.BuildingFkId == blockId
                                                  && r.FromDateTime >= _lastStart
                                                  && r.FromDateTime <= _lastEnd
                                            select new
                                            {
                                                Block = b.Name,
                                                Title = ars.AlertText,
                                                DataField = d.Name,
                                                Severity = r.Severity,
                                                Timestamp = r.FromDateTime,
                                                Condition = r.AlertCondition,
                                                ReferenceValue = r.ReferenceValue,
                                                Status = r.FMCCStatus
                                            }).Count();
                        data = (from r in db.Alerts
                                join b in db.Buildings on r.BuildingFkId equals b.Id
                                join d in db.DataFields on r.DataFieldFkId equals d.Id
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                join bd in db.BuildingObjectDatas on r.DataFieldFkId equals bd.DataFieldFkId
                                where bd.DataFieldUnit == unit
                                    && r.BuildingFkId == blockId
                                    && r.FromDateTime >= _lastStart
                                    && r.FromDateTime <= _lastEnd
                                orderby r.FromDateTime
                                select new
                                {
                                    Block = b.Name,
                                    Title = ars.AlertText,
                                    DataField = d.Name,
                                    Severity = r.Severity,
                                    Timestamp = r.FromDateTime,
                                    Condition = r.AlertCondition,
                                    ReferenceValue = r.ReferenceValue,
                                    Status = r.FMCCStatus
                                }).Skip(start).Take(length).ToList()
                                    .Select(l => new AlertDTO
                                    {
                                        Block = l.Block,
                                        Title = l.Title,
                                        DataField = l.DataField,
                                        Severity = l.Severity,
                                        Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                        Condition = l.Condition,
                                        ReferenceValue = l.ReferenceValue,
                                        Status = l.Status
                                    }).ToList();
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }


            var result = this.Json(new
            {
                draw = Convert.ToInt32(queryString["draw"]),
                data = data,

                recordsFiltered = totalRecordCount,
                recordsTotal = totalRecordCount
            });
            return result;
        }

        [Route("api/report/ocrdd/{blockId}/{lastStart}/{lastEnd}/{siteId}")]
        public OverCooledReportDashboardDataDTO GetOverCooledReportDashBoardData(int blockId, string lastStart, string lastEnd, int siteId)
        {
            DateTime _lastStart;
            DateTime _lastEnd;
            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            OverCooledReportDashboardDataDTO data = new OverCooledReportDashboardDataDTO();

            using (var db = new FMCCDataContext())
            {

                try
                {
                    var unit = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == "Temperature").UnitName;

                    if (blockId == -1)
                    {
                        var reading = (from r in db.Alerts
                                       join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                       join b in db.Buildings on d.BuildingFkId equals b.Id
                                       where d.DataFieldUnit == unit
                                       && r.FromDateTime >= _lastStart
                                       && r.FromDateTime <= _lastEnd
                                       && b.SiteId == siteId
                                       select r).OrderBy(l => l.FromDateTime).ToList();
                        if (reading.Count > 0)
                        {
                            data.Block = reading.Select(l => l.BuildingFkId).Distinct().Count();
                            data.LowestTemperature = (int)Math.Round(reading.Select(l => l.AlertValue).Min(), 0);
                            data.Equipement = reading.Select(l => new { l.DataFieldFkId, l.ObjetFkId }).Distinct().Count();
                            data.DayCount = (reading[reading.Count - 1].FromDateTime - reading[0].FromDateTime).Days;
                            data.Unit = unit;
                        }
                        else
                        {
                            data.Block = 0;
                            data.LowestTemperature = 0.00;
                            data.Equipement = 0;
                            data.DayCount = 0;
                            data.Unit = unit;
                        }

                    }
                    else
                    {
                        var reading = (from r in db.Alerts
                                       join d in db.BuildingObjectDatas on r.DataFieldFkId equals d.DataFieldFkId
                                       where r.BuildingFkId == blockId
                                       && d.DataFieldUnit == unit
                                       && r.FromDateTime >= _lastStart
                                       && r.FromDateTime <= _lastEnd
                                       select r).OrderBy(l => l.FromDateTime).ToList();
                        if (reading.Count > 0)
                        {
                            data.Block = reading.Select(l => l.BuildingFkId).Distinct().Count();
                            data.LowestTemperature = (int)Math.Round(reading.Select(l => l.AlertValue).Min(), 0);
                            data.Equipement = reading.Select(l => new { l.DataFieldFkId, l.ObjetFkId }).Distinct().Count();
                            data.DayCount = (reading[reading.Count - 1].FromDateTime - reading[0].FromDateTime).Days;
                            data.Unit = unit;
                        }
                        else
                        {
                            data.Block = 0;
                            data.LowestTemperature = 0.00;
                            data.Equipement = 0;
                            data.DayCount = 0;
                            data.Unit = unit;
                        }
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            return data;
        }

        [System.Web.Http.HttpGet]
        [Route("api/report/ocalert")]
        public object GetOverCooledAlert()
        {
            int start = 0;
            int length = 10;
            DateTime _lastStart = DateTime.MinValue;
            DateTime _lastEnd = DateTime.MinValue;
            int siteId = 1;
            int blockId = -1;
            var queryString = Request.GetQueryNameValuePairs()
                .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
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

            if (queryString.ContainsKey("length"))
            {
                if (!string.IsNullOrEmpty(queryString["length"]))
                {
                    length = Convert.ToInt32(queryString["length"]);
                }
            }

            if (queryString.ContainsKey("block"))
            {
                if (!string.IsNullOrEmpty(queryString["block"]))
                {
                    blockId = Convert.ToInt32(queryString["block"]);
                }
            }

            if (queryString.ContainsKey("startDate"))
            {
                if (!string.IsNullOrEmpty(queryString["startDate"]))
                {
                    DateTime.TryParseExact(queryString["startDate"], "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);

                }
            }

            if (queryString.ContainsKey("endDate"))
            {
                if (!string.IsNullOrEmpty(queryString["endDate"]))
                {
                    DateTime.TryParseExact(queryString["endDate"], "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

                }
            }

            List<AlertDTO> data = new List<AlertDTO>();
            int totalRecordCount = 0;

            using (var db = new FMCCDataContext())
            {
                try
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
                    if (blockId == -1)
                    {
                        totalRecordCount = (from r in db.Alerts
                                            join b in db.Buildings on r.BuildingFkId equals b.Id
                                            join o in db.Objects on r.ObjetFkId equals o.Id
                                            join d in db.DataFields on r.DataFieldFkId equals d.Id
                                            join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                            join u in db.BuildingObjectDatas on r.ObjetFkId equals u.ObjectFkId
                                            where u.DataFieldUnit == unit
                                                  && b.SiteId == siteId
                                                  && r.FromDateTime >= _lastStart
                                                  && r.FromDateTime <= _lastEnd
                                            select new
                                            {
                                                Block = b.Name,
                                                Title = ars.AlertText,
                                                DataField = o.Name + " " + d.Name,
                                                Severity = r.Severity,
                                                Timestamp = r.FromDateTime,
                                                Condition = r.AlertCondition,
                                                ReferenceValue = r.ReferenceValue,
                                                Status = r.FMCCStatus
                                            }).Count();

                        data = (from r in db.Alerts
                                join b in db.Buildings on r.BuildingFkId equals b.Id
                                join o in db.Objects on r.ObjetFkId equals o.Id
                                join d in db.DataFields on r.DataFieldFkId equals d.Id
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                join u in db.BuildingObjectDatas on r.ObjetFkId equals u.ObjectFkId
                                where u.DataFieldUnit == unit
                                && b.SiteId == siteId
                                && r.FromDateTime >= _lastStart
                                && r.FromDateTime <= _lastEnd
                                orderby r.FromDateTime descending
                                select new
                                {
                                    Block = b.Name,
                                    Title = ars.AlertText,
                                    DataField = o.Name + " " + d.Name,
                                    Severity = r.Severity,
                                    Timestamp = r.FromDateTime,
                                    Condition = r.AlertCondition,
                                    ReferenceValue = r.ReferenceValue,
                                    Status = r.FMCCStatus
                                }).Skip(start).Take(length).ToList()
                                .Select(l => new AlertDTO
                                {
                                    Block = l.Block,
                                    Title = l.Title,
                                    DataField = l.DataField,
                                    Severity = l.Severity,
                                    Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                    Condition = l.Condition.Replace("then", "than"),
                                    ReferenceValue = l.ReferenceValue,
                                    Status = l.Status
                                }).ToList();
                    }
                    else
                    {
                        totalRecordCount = (from r in db.Alerts
                                            join b in db.Buildings on r.BuildingFkId equals b.Id
                                            join d in db.DataFields on r.DataFieldFkId equals d.Id
                                            join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                            join u in db.BuildingObjectDatas on r.ObjetFkId equals u.ObjectFkId
                                            where r.BuildingFkId == blockId
                                                  && u.DataFieldUnit == unit
                                                  && r.FromDateTime >= _lastStart
                                                  && r.FromDateTime <= _lastEnd
                                            orderby r.FromDateTime
                                            select new
                                            {
                                                Block = b.Name,
                                                Title = ars.AlertText,
                                                DataField = d.Name,
                                                Severity = r.Severity,
                                                Timestamp = r.FromDateTime,
                                                Condition = r.AlertCondition,
                                                ReferenceValue = r.ReferenceValue,
                                                Status = r.FMCCStatus
                                            }).Count();
                        data = (from r in db.Alerts
                                join b in db.Buildings on r.BuildingFkId equals b.Id
                                join d in db.DataFields on r.DataFieldFkId equals d.Id
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                join u in db.BuildingObjectDatas on r.ObjetFkId equals u.ObjectFkId
                                where r.BuildingFkId == blockId
                                   && u.DataFieldUnit == unit
                                   && r.FromDateTime >= _lastStart
                                   && r.FromDateTime <= _lastEnd
                                orderby r.FromDateTime
                                select new
                                {
                                    Block = b.Name,
                                    Title = ars.AlertText,
                                    DataField = d.Name,
                                    Severity = r.Severity,
                                    Timestamp = r.FromDateTime,
                                    Condition = r.AlertCondition,
                                    ReferenceValue = r.ReferenceValue,
                                    Status = r.FMCCStatus
                                }).Skip(start).Take(length).ToList()
                                    .Select(l => new AlertDTO
                                    {
                                        Block = l.Block,
                                        Title = l.Title,
                                        DataField = l.DataField,
                                        Severity = l.Severity,
                                        Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                        Condition = l.Condition,
                                        ReferenceValue = l.ReferenceValue,
                                        Status = l.Status
                                    }).ToList();
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }
            var result = this.Json(new
            {
                draw = Convert.ToInt32(queryString["draw"]),
                data = data,

                recordsFiltered = totalRecordCount,
                recordsTotal = totalRecordCount
            });
            return result;
        }
        [System.Web.Http.HttpGet]
        [Route("api/report/alertcount/{blockId}/{type}/{startDate}/{endDate}")]
        public int GetAlertCount(int blockId, int type, string startDate, string endDate)
        {
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(startDate, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(endDate, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            int count = 0;
            try
            {
                using (var db = new FMCCDataContext())
                {
                    try
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
                        if (blockId == -1)
                        {
                            count = (from r in db.Alerts
                                     join b in db.Buildings on r.BuildingFkId equals b.Id
                                     join o in db.Objects on r.ObjetFkId equals o.Id
                                     join d in db.DataFields on r.DataFieldFkId equals d.Id
                                     join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                     join u in db.BuildingObjectDatas on r.ObjetFkId equals u.ObjectFkId
                                     where u.DataFieldUnit == unit
                                           && r.FromDateTime >= _lastStart
                                           && r.FromDateTime <= _lastEnd
                                     orderby r.FromDateTime descending
                                     select new
                                     {
                                         Block = b.Name,
                                         Title = ars.AlertText,
                                         DataField = o.Name + " " + d.Name,
                                         Severity = r.Severity,
                                         Timestamp = r.FromDateTime,
                                         Condition = r.AlertCondition,
                                         ReferenceValue = r.ReferenceValue,
                                         Status = r.FMCCStatus
                                     }).Count();

                        }
                        else
                        {
                            count = (from r in db.Alerts
                                     join b in db.Buildings on r.BuildingFkId equals b.Id
                                     join d in db.DataFields on r.DataFieldFkId equals d.Id
                                     join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                     join u in db.BuildingObjectDatas on r.ObjetFkId equals u.ObjectFkId
                                     where r.BuildingFkId == blockId
                                        && u.DataFieldUnit == unit
                                        && r.FromDateTime >= _lastStart
                                        && r.FromDateTime <= _lastEnd
                                     orderby r.FromDateTime
                                     select new
                                     {
                                         Block = b.Name,
                                         Title = ars.AlertText,
                                         DataField = d.Name,
                                         Severity = r.Severity,
                                         Timestamp = r.FromDateTime,
                                         Condition = r.AlertCondition,
                                         ReferenceValue = r.ReferenceValue,
                                         Status = r.FMCCStatus
                                     }).Count();
                        }
                    }
                    catch (Exception ex)
                    {
                        logger.Error(ex.ToString());
                    }

                }

            }
            catch (Exception e)
            {
            }
            return count;
        }

        [Route("api/report/eqalert/{blockId}/{lastStart}/{lastEnd}/{siteId}")]
        public List<AlertDTO> GetEquipementAlert(int blockId, string lastStart, string lastEnd, int siteId)
        {
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            List<AlertDTO> data = new List<AlertDTO>();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    if (blockId == -1)
                    {
                        data = (from r in db.Alerts
                                join b in db.Buildings on r.BuildingFkId equals b.Id
                                join o in db.Objects on r.ObjetFkId equals o.Id
                                join d in db.DataFields on r.DataFieldFkId equals d.Id
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                where r.Type == 4
                                && r.FromDateTime >= _lastStart
                                && r.FromDateTime <= _lastEnd
                                && b.SiteId == siteId
                                orderby r.FromDateTime descending
                                select new
                                {
                                    Block = b.Name,
                                    Title = ars.AlertText,
                                    DataField = o.Name + " " + d.Name,
                                    Severity = r.Severity,
                                    Timestamp = r.FromDateTime,
                                    Condition = r.AlertCondition,
                                    ReferenceValue = r.ReferenceValue,
                                    Status = r.FMCCStatus
                                }).ToList()
                                .Select(l => new AlertDTO
                                {
                                    Block = l.Block,
                                    Title = l.Title,
                                    DataField = l.DataField,
                                    Severity = l.Severity,
                                    Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                    Condition = l.Condition,
                                    ReferenceValue = l.ReferenceValue,
                                    Status = l.Status
                                }).ToList();
                    }
                    else
                    {
                        data = (from r in db.Alerts
                                join b in db.Buildings on r.BuildingFkId equals b.Id
                                join d in db.DataFields on r.DataFieldFkId equals d.Id
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                where r.BuildingFkId == blockId
                                   && r.Type == 4
                                   && r.FromDateTime >= _lastStart
                                   && r.FromDateTime <= _lastEnd
                                orderby r.FromDateTime descending
                                select new
                                {
                                    Block = b.Name,
                                    Title = ars.AlertText,
                                    DataField = d.Name,
                                    Severity = r.Severity,
                                    Timestamp = r.FromDateTime,
                                    Condition = r.AlertCondition,
                                    ReferenceValue = r.ReferenceValue,
                                    Status = r.FMCCStatus
                                }).ToList()
                                    .Select(l => new AlertDTO
                                    {
                                        Block = l.Block,
                                        Title = l.Title,
                                        DataField = l.DataField,
                                        Severity = l.Severity,
                                        Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                        Condition = l.Condition,
                                        ReferenceValue = l.ReferenceValue,
                                        Status = l.Status
                                    }).ToList();
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            return data;
        }
        [Route("api/report/eqalertWithPaging")]
        public object GetEquipementAlertWithPaging()
        {
            int start = 0;
            int length = 10;
            DateTime _lastStart = DateTime.MinValue;
            DateTime _lastEnd = DateTime.MinValue;
            int siteId = 1;
            int blockId = -1;
            var queryString = Request.GetQueryNameValuePairs()
                .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
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

            if (queryString.ContainsKey("length"))
            {
                if (!string.IsNullOrEmpty(queryString["length"]))
                {
                    length = Convert.ToInt32(queryString["length"]);
                }
            }

            if (queryString.ContainsKey("block"))
            {
                if (!string.IsNullOrEmpty(queryString["block"]))
                {
                    blockId = Convert.ToInt32(queryString["block"]);
                }
            }

            if (queryString.ContainsKey("startDate"))
            {
                if (!string.IsNullOrEmpty(queryString["startDate"]))
                {
                    DateTime.TryParseExact(queryString["startDate"], "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);

                }
            }

            if (queryString.ContainsKey("endDate"))
            {
                if (!string.IsNullOrEmpty(queryString["endDate"]))
                {
                    DateTime.TryParseExact(queryString["endDate"], "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

                }
            }

            List<AlertDTO> data = new List<AlertDTO>();
            int totalRecordCount = 0;

            using (var db = new FMCCDataContext())
            {
                try
                {
                    if (blockId == -1)
                    {
                        totalRecordCount = (from r in db.Alerts
                                            join b in db.Buildings on r.BuildingFkId equals b.Id
                                            join o in db.Objects on r.ObjetFkId equals o.Id
                                            join d in db.DataFields on r.DataFieldFkId equals d.Id
                                            join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                            where r.Type == 4
                                                  && r.FromDateTime >= _lastStart
                                                  && r.FromDateTime <= _lastEnd
                                                  && b.SiteId == siteId
                                            select new
                                            {
                                                Block = b.Name,
                                                Title = ars.AlertText,
                                                DataField = o.Name + " " + d.Name,
                                                Severity = r.Severity,
                                                Timestamp = r.FromDateTime,
                                                Condition = r.AlertCondition,
                                                ReferenceValue = r.ReferenceValue,
                                                Status = r.FMCCStatus
                                            }).Count();
                        data = (from r in db.Alerts
                                join b in db.Buildings on r.BuildingFkId equals b.Id
                                join o in db.Objects on r.ObjetFkId equals o.Id
                                join d in db.DataFields on r.DataFieldFkId equals d.Id
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                where r.Type == 4
                                && r.FromDateTime >= _lastStart
                                && r.FromDateTime <= _lastEnd
                                && b.SiteId == siteId
                                orderby r.FromDateTime descending
                                select new
                                {
                                    Block = b.Name,
                                    Title = ars.AlertText,
                                    DataField = o.Name + " " + d.Name,
                                    Severity = r.Severity,
                                    Timestamp = r.FromDateTime,
                                    Condition = r.AlertCondition,
                                    ReferenceValue = r.ReferenceValue,
                                    Status = r.FMCCStatus
                                }).Skip(start).Take(length).ToList()
                                .Select(l => new AlertDTO
                                {
                                    Block = l.Block,
                                    Title = l.Title,
                                    DataField = l.DataField,
                                    Severity = l.Severity,
                                    Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                    Condition = l.Condition,
                                    ReferenceValue = l.ReferenceValue,
                                    Status = l.Status
                                }).ToList();
                    }
                    else
                    {
                        totalRecordCount = (from r in db.Alerts
                                            join b in db.Buildings on r.BuildingFkId equals b.Id
                                            join d in db.DataFields on r.DataFieldFkId equals d.Id
                                            join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                            where r.BuildingFkId == blockId
                                                  && r.Type == 4
                                                  && r.FromDateTime >= _lastStart
                                                  && r.FromDateTime <= _lastEnd
                                                  && b.SiteId == siteId
                                            orderby r.FromDateTime descending
                                            select new
                                            {
                                                Block = b.Name,
                                                Title = ars.AlertText,
                                                DataField = d.Name,
                                                Severity = r.Severity,
                                                Timestamp = r.FromDateTime,
                                                Condition = r.AlertCondition,
                                                ReferenceValue = r.ReferenceValue,
                                                Status = r.FMCCStatus
                                            }).Count();
                        data = (from r in db.Alerts
                                join b in db.Buildings on r.BuildingFkId equals b.Id
                                join d in db.DataFields on r.DataFieldFkId equals d.Id
                                join ars in db.AlertRuleSetups on r.AlertRuleId equals ars.Id
                                where r.BuildingFkId == blockId
                                   && r.Type == 4
                                   && r.FromDateTime >= _lastStart
                                   && r.FromDateTime <= _lastEnd
                                   && b.SiteId == siteId
                                orderby r.FromDateTime descending
                                select new
                                {
                                    Block = b.Name,
                                    Title = ars.AlertText,
                                    DataField = d.Name,
                                    Severity = r.Severity,
                                    Timestamp = r.FromDateTime,
                                    Condition = r.AlertCondition,
                                    ReferenceValue = r.ReferenceValue,
                                    Status = r.FMCCStatus
                                }).Skip(start).Take(length).ToList()
                                    .Select(l => new AlertDTO
                                    {
                                        Block = l.Block,
                                        Title = l.Title,
                                        DataField = l.DataField,
                                        Severity = l.Severity,
                                        Timestamp = l.Timestamp.ToString("dd MMM yyyy"),
                                        Condition = l.Condition,
                                        ReferenceValue = l.ReferenceValue,
                                        Status = l.Status
                                    }).ToList();
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            var result = this.Json(new
            {
                draw = Convert.ToInt32(queryString["draw"]),
                data = data,

                recordsFiltered = totalRecordCount,
                recordsTotal = totalRecordCount
            });
            return result;
        }
        [Route("api/report/daytoday/{blockId}/{objectId}/{dataFieldId}/{startDateOne}/{endDateOne}/{startDateTwo}/{endDateTwo}")]
        public DayToDayDTO GetDayToDay(int blockId, int objectId, int dataFieldId, string startDateOne, string endDateOne, string startDateTwo, string endDateTwo)
        {
            DateTime _startDateOne;
            DateTime _endDateOne;
            DateTime _startDateTwo;
            DateTime _endDateTwo;

            DateTime.TryParseExact(startDateOne, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _startDateOne);
            DateTime.TryParseExact(endDateOne, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _endDateOne);
            DateTime.TryParseExact(startDateTwo, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _startDateTwo);
            DateTime.TryParseExact(endDateTwo, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _endDateTwo);

            DayToDayDTO data = new DayToDayDTO();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var day1 = (from r in db.TempReadings
                                where r.BuildingFkId == blockId
                                && r.ObjectFkId == objectId
                                && r.DataFieldFkId == dataFieldId
                                && r.Timestamp >= _startDateOne
                                && r.Timestamp <= _endDateOne
                                orderby r.Timestamp
                                select r).ToList();

                    var day2 = (from r in db.TempReadings
                                where r.BuildingFkId == blockId
                                && r.ObjectFkId == objectId
                                && r.DataFieldFkId == dataFieldId
                                && r.Timestamp >= _startDateTwo
                                && r.Timestamp <= _endDateTwo
                                orderby r.Timestamp
                                select r).ToList();

                    DateTime dt;
                    if (day2.Count > day1.Count)
                    {
                        dt = day2[0].Timestamp;
                    }
                    else
                    {
                        dt = day1[0].Timestamp;
                    }

                    data.Object = db.Objects.Where(l => l.Id == objectId).Select(l => l.Name).FirstOrDefault();
                    data.DataField = db.DataFields.Where(l => l.Id == dataFieldId).Select(l => l.Name).FirstOrDefault();
                    data.DataOne = ComputeHelper.GetCompareData(day1, dt);
                    data.DataTwo = ComputeHelper.GetCompareData(day2, dt);
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            return data;
        }

        [Route("api/report/histogramBack/{blockId}/{type}/{lastStart}/{lastEnd}/{siteId}")]
        public List<EquipmentReturnDTO> GetEquipmentHistogramBack(int blockId, string type, string lastStart, string lastEnd, int siteId)
        {
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            List<EquipmentReturnDTO> data = new List<EquipmentReturnDTO>();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    if (blockId == -1)
                    {
                        if (type == "all")
                        {
                            List<ObjectOnOffMapping> list = new List<ObjectOnOffMapping>();
                            var query = from b in db.BuildingObjectDatas
                                        join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                        join p in db.Buildings on b.BuildingFkId equals p.Id
                                        select n;
                            list = query.ToList();
                            data = (from r in db.TempReadings
                                    join o in list on r.DataFieldFkId equals o.DataFieldFkId

                                    where (r.Value == 1 || r.Value == 0)
                                    && r.Timestamp >= _lastStart
                                    && r.Timestamp <= _lastEnd

                                    group r by r.BuildingFkId into gg
                                    select new EquipmentReturnDTO
                                    {
                                        Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                        OperatingStart = "08:00:00 AM",
                                        OperatingEnd = "05:00:00 PM",
                                        EquipmentData = (from rr in gg
                                                         group rr by rr.ObjectFkId into g
                                                         select new EquipmentHistogramDTO
                                                         {
                                                             Equipment = db.Objects.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                                             Data = g.OrderBy(l => l.Timestamp).ToList()
                                                         }).ToList()
                                    }).ToList();
                        }
                        else if (type == "ok")
                        {
                            data = (from r in db.TempReadings
                                    join o in db.ObjectOnOffMappings on r.DataFieldFkId equals o.DataFieldFkId
                                    where !db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.ObjetFkId == r.ObjectFkId)
                                    && (r.Value == 1 || r.Value == 0)
                                    && r.Timestamp >= _lastStart
                                    && r.Timestamp <= _lastEnd
                                    group r by r.BuildingFkId into gg
                                    select new EquipmentReturnDTO
                                    {
                                        Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                        OperatingStart = "08:00:00 AM",
                                        OperatingEnd = "05:00:00 PM",
                                        EquipmentData = (from rr in gg
                                                         group rr by rr.ObjectFkId into g
                                                         select new EquipmentHistogramDTO
                                                         {
                                                             Equipment = db.Objects.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                                             Data = g.OrderBy(l => l.Timestamp).ToList()
                                                         }).ToList()
                                    }).ToList();
                        }
                        else if (type == "faulty")
                        {
                            data = (from r in db.TempReadings
                                    join o in db.ObjectOnOffMappings on r.DataFieldFkId equals o.DataFieldFkId
                                    where db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.ObjetFkId == r.ObjectFkId)
                                    && (r.Value == 1 || r.Value == 0)
                                    && r.Timestamp >= _lastStart
                                    && r.Timestamp <= _lastEnd
                                    group r by r.BuildingFkId into gg
                                    select new EquipmentReturnDTO
                                    {
                                        Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                        OperatingStart = "08:00:00 AM",
                                        OperatingEnd = "05:00:00 PM",
                                        EquipmentData = (from rr in gg
                                                         group rr by rr.ObjectFkId into g
                                                         select new EquipmentHistogramDTO
                                                         {
                                                             Equipment = db.Objects.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                                             Data = g.OrderBy(l => l.Timestamp).ToList()
                                                         }).ToList()
                                    }).ToList();
                        }
                    }
                    else
                    {
                        if (type == "all")
                        {
                            data = (from r in db.TempReadings
                                    join o in db.ObjectOnOffMappings on r.DataFieldFkId equals o.DataFieldFkId
                                    where r.BuildingFkId == blockId
                                    && (r.Value == 1 || r.Value == 0)
                                    && r.Timestamp >= _lastStart
                                    && r.Timestamp <= _lastEnd
                                    group r by r.BuildingFkId into gg
                                    select new EquipmentReturnDTO
                                    {
                                        Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                        OperatingStart = "08:00:00 AM",
                                        OperatingEnd = "05:00:00 PM",
                                        EquipmentData = (from rr in gg
                                                         group rr by rr.ObjectFkId into g
                                                         select new EquipmentHistogramDTO
                                                         {
                                                             Equipment = db.Objects.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                                             Data = g.OrderBy(l => l.Timestamp).ToList()
                                                         }).ToList()
                                    }).ToList();
                        }
                        else if (type == "ok")
                        {
                            data = (from r in db.TempReadings
                                    join o in db.ObjectOnOffMappings on r.DataFieldFkId equals o.DataFieldFkId
                                    where !db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.BuildingFkId == blockId && l.ObjetFkId == r.ObjectFkId)
                                    && r.BuildingFkId == blockId
                                    && (r.Value == 1 || r.Value == 0)
                                    && r.Timestamp >= _lastStart
                                    && r.Timestamp <= _lastEnd
                                    group r by r.BuildingFkId into gg
                                    select new EquipmentReturnDTO
                                    {
                                        Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                        OperatingStart = "08:00:00 AM",
                                        OperatingEnd = "05:00:00 PM",
                                        EquipmentData = (from rr in gg
                                                         group rr by rr.ObjectFkId into g
                                                         select new EquipmentHistogramDTO
                                                         {
                                                             Equipment = db.Objects.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                                             Data = g.OrderBy(l => l.Timestamp).ToList()
                                                         }).ToList()
                                    }).ToList();
                        }
                        else if (type == "faulty")
                        {
                            data = (from r in db.TempReadings
                                    join o in db.ObjectOnOffMappings on r.DataFieldFkId equals o.DataFieldFkId
                                    where db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.BuildingFkId == blockId && l.ObjetFkId == r.ObjectFkId)
                                    && r.BuildingFkId == blockId
                                    && (r.Value == 1 || r.Value == 0)
                                    && r.Timestamp >= _lastStart
                                    && r.Timestamp <= _lastEnd
                                    group r by r.BuildingFkId into gg
                                    select new EquipmentReturnDTO
                                    {
                                        Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                        OperatingStart = "08:00:00 AM",
                                        OperatingEnd = "05:00:00 PM",
                                        EquipmentData = (from rr in gg
                                                         group rr by rr.ObjectFkId into g
                                                         select new EquipmentHistogramDTO
                                                         {
                                                             Equipment = db.Objects.Where(l => l.Id == g.Key).Select(l => l.Name).FirstOrDefault(),
                                                             Data = g.OrderBy(l => l.Timestamp).ToList()
                                                         }).ToList()
                                    }).ToList();
                        }
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }


            }

            return data;
        }

        [Route("api/report/histogram/{blockId}/{type}/{lastStart}/{lastEnd}/{siteId}")]
        public List<EquipmentReturnDTO> GetEquipmentHistogram(int blockId, string type, string lastStart, string lastEnd, int siteId)
        {
            DateTime _lastStart;
            DateTime _lastEnd;

            DateTime.TryParseExact(lastStart, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastStart);
            DateTime.TryParseExact(lastEnd, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _lastEnd);

            AppSettings apps = new AppSettings();
            string workingStart = apps.WorkingPeriodStart;
            string workingEnd = apps.WorkingPeriodEnd;
            bool temperaturebasedhistogram = apps.TemperatureBasedHistogram;
            //double temperaturethreshold = 0;
            string temperatureunit = string.Empty;//apps.TemperatureUnit;
            bool showOffStatus = apps.ShowOffStatus;

            List<EquipmentReturnDTO> data = new List<EquipmentReturnDTO>();

            using (var db = new FMCCDataContext())
            {
                var objectUnitMapping = db.ObjectUnitMappings.FirstOrDefault(x => x.ObjectDataField == "Temperature");
                if (objectUnitMapping !=
                    null)
                {
                    temperatureunit = objectUnitMapping.UnitName;

                }
                else
                {
                    temperatureunit = "c";
                }
                try
                {
                    if (temperaturebasedhistogram)
                    {
                        if (blockId == -1)
                        {
                            if (type == "all")
                            {
                                List<ObjectOnOffMapping> list = new List<ObjectOnOffMapping>();
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                list = query.ToList();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where o.Type == 2 // type 2 none on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            ShowOffStatus = showOffStatus,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();

                                foreach (var eqp in data)
                                {
                                    foreach (var eqd in eqp.EquipmentData)
                                    {
                                        int objectFkId = eqd.Data.Select(l => l.ObjectFkId).FirstOrDefault();
                                        int dataFieldFkId = eqd.Data.Select(l => l.DataFieldFkId).FirstOrDefault();
                                        double? temperaturethreshold = db.ObjectOnOffMappings.Where(l => l.ObjectFkId == objectFkId && l.DataFieldFkId == dataFieldFkId).Select(l => l.Thresold).FirstOrDefault();

                                        foreach (var dd in eqd.Data)
                                        {
                                            dd.Value = dd.Value <= temperaturethreshold ? 1 : 0;
                                        }
                                    }
                                }
                            }
                            else if (type == "ok")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where o.Type == 2 // type 2 none on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && !db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.ObjetFkId == r.ObjectFkId)
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();

                                foreach (var eqp in data)
                                {
                                    foreach (var eqd in eqp.EquipmentData)
                                    {
                                        int objectFkId = eqd.Data.Select(l => l.ObjectFkId).FirstOrDefault();
                                        int dataFieldFkId = eqd.Data.Select(l => l.DataFieldFkId).FirstOrDefault();
                                        double? temperaturethreshold = db.ObjectOnOffMappings.Where(l => l.ObjectFkId == objectFkId && l.DataFieldFkId == dataFieldFkId).Select(l => l.Thresold).FirstOrDefault();

                                        foreach (var dd in eqd.Data)
                                        {
                                            dd.Value = dd.Value <= temperaturethreshold ? 1 : 0;
                                        }
                                    }
                                }
                            }
                            else if (type == "faulty")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where o.Type == 2 // type 2 none on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.ObjetFkId == r.ObjectFkId)
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();

                                foreach (var eqp in data)
                                {
                                    foreach (var eqd in eqp.EquipmentData)
                                    {
                                        int objectFkId = eqd.Data.Select(l => l.ObjectFkId).FirstOrDefault();
                                        int dataFieldFkId = eqd.Data.Select(l => l.DataFieldFkId).FirstOrDefault();
                                        double? temperaturethreshold = db.ObjectOnOffMappings.Where(l => l.ObjectFkId == objectFkId && l.DataFieldFkId == dataFieldFkId).Select(l => l.Thresold).FirstOrDefault();

                                        foreach (var dd in eqd.Data)
                                        {
                                            dd.Value = dd.Value <= temperaturethreshold ? 1 : 0;
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (type == "all")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where o.Type == 2 // type 2 none on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && r.BuildingFkId == blockId
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();

                                foreach (var eqp in data)
                                {
                                    foreach (var eqd in eqp.EquipmentData)
                                    {
                                        int objectFkId = eqd.Data.Select(l => l.ObjectFkId).FirstOrDefault();
                                        int dataFieldFkId = eqd.Data.Select(l => l.DataFieldFkId).FirstOrDefault();
                                        double? temperaturethreshold = db.ObjectOnOffMappings.Where(l => l.ObjectFkId == objectFkId && l.DataFieldFkId == dataFieldFkId).Select(l => l.Thresold).FirstOrDefault();

                                        foreach (var dd in eqd.Data)
                                        {
                                            dd.Value = dd.Value <= temperaturethreshold ? 1 : 0;
                                        }
                                    }
                                }
                            }
                            else if (type == "ok")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where o.Type == 2 // type 2 none on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && !db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.BuildingFkId == blockId && l.ObjetFkId == r.ObjectFkId)
                                        && r.BuildingFkId == blockId
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();

                                foreach (var eqp in data)
                                {
                                    foreach (var eqd in eqp.EquipmentData)
                                    {
                                        int objectFkId = eqd.Data.Select(l => l.ObjectFkId).FirstOrDefault();
                                        int dataFieldFkId = eqd.Data.Select(l => l.DataFieldFkId).FirstOrDefault();
                                        double? temperaturethreshold = db.ObjectOnOffMappings.Where(l => l.ObjectFkId == objectFkId && l.DataFieldFkId == dataFieldFkId).Select(l => l.Thresold).FirstOrDefault();

                                        foreach (var dd in eqd.Data)
                                        {
                                            dd.Value = dd.Value <= temperaturethreshold ? 1 : 0;
                                        }
                                    }
                                }
                            }
                            else if (type == "faulty")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where o.Type == 2 // type 2 none on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.BuildingFkId == blockId && l.ObjetFkId == r.ObjectFkId)
                                        && r.BuildingFkId == blockId
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();

                                foreach (var eqp in data)
                                {
                                    foreach (var eqd in eqp.EquipmentData)
                                    {
                                        int objectFkId = eqd.Data.Select(l => l.ObjectFkId).FirstOrDefault();
                                        int dataFieldFkId = eqd.Data.Select(l => l.DataFieldFkId).FirstOrDefault();
                                        double? temperaturethreshold = db.ObjectOnOffMappings.Where(l => l.ObjectFkId == objectFkId && l.DataFieldFkId == dataFieldFkId).Select(l => l.Thresold).FirstOrDefault();

                                        foreach (var dd in eqd.Data)
                                        {
                                            dd.Value = dd.Value <= temperaturethreshold ? 1 : 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else // on off data
                    {
                        if (blockId == -1)
                        {
                            if (type == "all")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where o.Type == 1 // type 1 on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && (r.Value == 1 || r.Value == 0)
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();
                            }
                            else if (type == "ok")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where !db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.ObjetFkId == r.ObjectFkId)
                                        && o.Type == 1 // type 1 on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && (r.Value == 1 || r.Value == 0)
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();
                            }
                            else if (type == "faulty")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.ObjetFkId == r.ObjectFkId)
                                        && o.Type == 1 // type 1 on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && (r.Value == 1 || r.Value == 0)
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();
                            }
                        }
                        else
                        {
                            if (type == "all")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where o.Type == 1 // type 1 on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && r.BuildingFkId == blockId
                                        && (r.Value == 1 || r.Value == 0)
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();
                            }
                            else if (type == "ok")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where !db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.BuildingFkId == blockId && l.ObjetFkId == r.ObjectFkId)
                                        && o.Type == 1 // type 1 on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && r.BuildingFkId == blockId
                                        && (r.Value == 1 || r.Value == 0)
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();
                            }
                            else if (type == "faulty")
                            {
                                var query = (from b in db.BuildingObjectDatas
                                             join n in db.ObjectOnOffMappings on b.ObjectFkId equals n.ObjectFkId.Value
                                             join p in db.Buildings on b.BuildingFkId equals p.Id
                                             where p.SiteId == siteId
                                             select n).Distinct();
                                data = (from r in db.TempReadings
                                        join o in query on r.DataFieldFkId equals o.DataFieldFkId
                                        where db.Alerts.Any(l => (l.AlertValue == 0 || l.AlertValue == 1) && l.FromDateTime >= _lastStart && l.FromDateTime <= _lastEnd && l.BuildingFkId == blockId && l.ObjetFkId == r.ObjectFkId)
                                        && o.Type == 1 // type 1 on/off based data
                                        && r.ObjectFkId == o.ObjectFkId
                                        && r.BuildingFkId == blockId
                                        && (r.Value == 1 || r.Value == 0)
                                        && r.Timestamp >= _lastStart
                                        && r.Timestamp <= _lastEnd
                                        group r by r.BuildingFkId into gg
                                        select new EquipmentReturnDTO
                                        {
                                            Block = db.Buildings.Where(l => l.Id == gg.Key).Select(l => l.Name).FirstOrDefault(),
                                            OperatingStart = workingStart,
                                            OperatingEnd = workingEnd,
                                            EquipmentData = (from rr in gg
                                                             group rr by new { rr.ObjectFkId, rr.DataFieldFkId } into g
                                                             let dataFiledName = db.DataFields.Where(l => l.Id == g.Key.DataFieldFkId).Select(l => l.Name).FirstOrDefault()
                                                             let objectFiledName = db.Objects.Where(l => l.Id == g.Key.ObjectFkId).Select(l => l.Name).FirstOrDefault()
                                                             select new EquipmentHistogramDTO
                                                             {
                                                                 Equipment = (objectFiledName + " <br/> " + dataFiledName),
                                                                 Data = g.OrderBy(l => l.Timestamp).ToList()
                                                             }).ToList()
                                        }).ToList();
                            }
                        }
                    }


                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }


            }

            return data;
        }

        [Route("api/report/equipmentobject/{blockId}")]
        public List<ObjectOnOffMapping> GetEquipmentObject(int blockId)
        {
            List<ObjectOnOffMapping> data = new List<ObjectOnOffMapping>();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    if (blockId == -1)
                    {
                        data = (from o in db.ObjectOnOffMappings
                                select o).ToList();
                    }
                    else
                    {
                        data = (from o in db.ObjectOnOffMappings
                                join obj in db.BuildingObjectDatas on o.ObjectFkId equals obj.ObjectFkId
                                where obj.BuildingFkId == blockId
                                select o).ToList();
                    }
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }


            }

            return data;
        }

        [Route("api/report/workingperiod")]
        public WorkingPeriodDTO GetWorkingPeriod()
        {
            WorkingPeriodDTO data = new WorkingPeriodDTO();

            AppSettings apps = new AppSettings();
            data.Start = apps.WorkingPeriodStart;
            data.End = apps.WorkingPeriodEnd;

            return data;
        }

        [Route("api/report/weektoweek")]
        public void GetWeekToWeek()
        {
            Debug.WriteLine("week to week");
        }

        [Route("api/report/monthtotmonth")]
        public void GetMonthToMonth()
        {
            Debug.WriteLine("month to month");
        }

        [Route("api/report/singledatetwodatapoint/{blockId}/{objectId1}/{dataFieldId1}/{objectId2}/{dataFieldId2}/{startDateOne}/{endDateOne}")]
        public SingleDateTwoDataPointDTO GetSingleDateTwoDataPoint(int blockId, int objectId1, int dataFieldId1, int objectId2, int dataFieldId2, string startDateOne, string endDateOne)
        {
            DateTime _startDateOne;
            DateTime _endDateOne;

            DateTime.TryParseExact(startDateOne, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _startDateOne);
            DateTime.TryParseExact(endDateOne, "yyyy-MM-ddTHH-mm-ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out _endDateOne);

            SingleDateTwoDataPointDTO data = new SingleDateTwoDataPointDTO();

            using (var db = new FMCCDataContext())
            {
                try
                {
                    var day1 = (from r in db.TempReadings
                                where r.BuildingFkId == blockId
                                && r.ObjectFkId == objectId1
                                && r.DataFieldFkId == dataFieldId1
                                && r.Timestamp >= _startDateOne
                                && r.Timestamp <= _endDateOne
                                orderby r.Timestamp
                                select r).ToList();

                    var day2 = (from r in db.TempReadings
                                where r.BuildingFkId == blockId
                                && r.ObjectFkId == objectId2
                                && r.DataFieldFkId == dataFieldId2
                                && r.Timestamp >= _startDateOne
                                && r.Timestamp <= _endDateOne
                                orderby r.Timestamp
                                select r).ToList();

                    data.ObjectOne = db.Objects.Where(l => l.Id == objectId1).Select(l => l.Name).FirstOrDefault();
                    data.DataFieldOne = db.DataFields.Where(l => l.Id == dataFieldId1).Select(l => l.Name).FirstOrDefault();
                    data.DataOne = ComputeHelper.GetCompareDataSingleDate(day1);
                    data.ObjectTwo = db.Objects.Where(l => l.Id == objectId2).Select(l => l.Name).FirstOrDefault();
                    data.DataFieldTwo = db.DataFields.Where(l => l.Id == dataFieldId2).Select(l => l.Name).FirstOrDefault();
                    data.DataTwo = ComputeHelper.GetCompareDataSingleDate(day2);
                }
                catch (Exception ex)
                {
                    logger.Error(ex.ToString());
                }

            }

            return data;
        }
    }
}
