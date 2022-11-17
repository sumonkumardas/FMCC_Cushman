using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using Quartz;

namespace Fmcc.JobScheduler
{
    public class SinglePointAlartJob : IJob
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        /// <summary>
        /// Execute email sending job
        /// </summary>
        /// <param name="context"></param>
        public async void Execute(IJobExecutionContext context)
        {
            try
            {

                string portalUrl = ConfigurationManager.AppSettings["PortalURL"];

                logger.Info("Single Point Alert Processing Scheduler Execute Successfully");

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(portalUrl);
                    client.Timeout = TimeSpan.FromMinutes(10);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    try
                    {
                        HttpResponseMessage response = client.GetAsync("api/AlertData/AlertSinglePointProcessing").Result; //("api/AlertData/AlertSinglePointProcessing").Result;
                        if (response.IsSuccessStatusCode)
                        {

                        }
                    }

                    catch (System.Exception exception)
                    {
                        logger.Error(exception.Message);

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