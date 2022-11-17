using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Quartz;
using Quartz.Impl;

namespace Fmcc.JobScheduler
{
    public class JobScheduler
    {
        /// <summary>
        /// Create Job schuduler
        /// </summary>
        public static void Start()
        {
            int alertDataTime = Convert.ToInt32(ConfigurationManager.AppSettings["AlertData"]);
            int alertDataTimeSinglePoint = Convert.ToInt32(ConfigurationManager.AppSettings["SinglePointInterval"]);


            ISchedulerFactory schedulerFactory = new StdSchedulerFactory();
            IScheduler scheduler = schedulerFactory.GetScheduler();
            scheduler.Start();

            IJobDetail dailyAlartJobDetail =
                JobBuilder.Create<AlertDataDailyJob>()
                    .WithIdentity("dailyalartjob", "dailyalartgroup")
                    .Build();
            //ITrigger trigger =
            //    TriggerBuilder.Create()
            //         .WithIdentity("dailyalarmtrigger", "dailyalartgroup")
            //         .StartNow()
            //    .WithSimpleSchedule(x => x
            //        .WithIntervalInHours(alertDataTime)
            //        .RepeatForever())
            //    .Build();
            //scheduler.ScheduleJob(dailyAlartJobDetail, trigger);

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("dailyalarmtrigger", "dailyalartgroup")
                .WithDailyTimeIntervalSchedule
                  (s =>
                     s.WithIntervalInHours(1)
                    .OnEveryDay()
                    .StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(0, 1))
                  )
                  .StartNow()
                .Build();
            scheduler.ScheduleJob(dailyAlartJobDetail, trigger);

            ISchedulerFactory schedulerFactory1 = new StdSchedulerFactory();
            IScheduler singlePointScheduler = schedulerFactory1.GetScheduler();
            singlePointScheduler.Start();

            IJobDetail singlePointJobDetail =
                JobBuilder.Create<SinglePointAlartJob>()
                    .WithIdentity("singlePointAlartjob", "singlePointAlartgroup")
                    .Build();
            ITrigger heartbeattrigger =
                TriggerBuilder.Create()
                     .WithIdentity("singlePointAlarttrigger", "singlePointAlartgroup")
                     .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInMinutes(60)
                    .RepeatForever())
                .Build();
            singlePointScheduler.ScheduleJob(singlePointJobDetail, heartbeattrigger);
        }
    }
}