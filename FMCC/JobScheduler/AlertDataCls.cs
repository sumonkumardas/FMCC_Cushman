using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using Fmcc.Models;
using Fmcc.Models.EntityDataModel;
using Quartz;

namespace Fmcc.JobScheduler
{
    public class AlertDataDailyJob : IJob
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        /// <summary>
        /// Execute alert job
        /// </summary>
        /// <param name="context"></param>
        public async void Execute(IJobExecutionContext context)
        {
            try
            {
                logger.Info("Daily Alert Processing Scheduler Execute Successfully");
                string portalUrl = ConfigurationManager.AppSettings["PortalURL"];

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(portalUrl);
                    client.Timeout = TimeSpan.FromMinutes(10);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));


                    HttpResponseMessage response = client.GetAsync("api/AlertData/AlertTotalComsuptionProcessing").Result;

                    if (response.IsSuccessStatusCode)
                    {

                    }
                }
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);

            }

        }
    }

}