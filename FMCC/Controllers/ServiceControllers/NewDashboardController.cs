using System;
using System.Linq;
using Fmcc.Extension;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using System.Collections.Generic;
using Fmcc.Models;
using log4net;

namespace Fmcc.Controllers.ServiceControllers
{
    public class NewDashboardController : ApiController
    {
        readonly ILog logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private FMCCDataContext context;

        public NewDashboardController()
        {
            context = new FMCCDataContext();
        }

        [HttpGet]
        [Route("api/newdashboard")]
        public Output GetDashboard()
        {
            Output output = new Output();
            try
            {
                var siteList = context.Database.SqlQuery<SiteModel>(
                                @";with cteBuildingAlarms as 
                                 (
                                    select distinct Building.Id, Building.SiteId
                                    from Building inner join [dbo].[BuildingAlarmForward]
                                    on Building.Id = [BuildingAlarmForward].BuildingFkId inner join [Alarm]
                                    on [BuildingAlarmForward].StatusName = [Alarm].Itqf
                                    where [Alarm].FMCCStatus = 1
                                 )


                                select [Site].Id,
	                                    [Site].Name,
	                                    [Site].Address,
	                                    [Site].Latitude as Lattitude,
	                                    [Site].Latitude as Latitude,
	                                    [Site].Longitude,
	                                    [Site].ImageLocation,
	                                    [Site].Active,
	                                    case when cteBuildingAlarms.SiteId is null then cast(0 as bit) else cast(1 as bit) end IsAlarmed,
		                                STUFF((select ', '+Building.BuildingId from Building where Building.SiteId = [Site].Id order by Building.BuildingId for xml path('')),1,1,'') as Blocks 
                                from [Site] left outer join cteBuildingAlarms
                                on [Site].Id = cteBuildingAlarms.SiteId
                                where [Site].Latitude is not null
                                and [Site].Longitude is not null").ToList();
                    //(
                    //                from s in context.Sites
                    //                join b in  context.Buildings on s.Id equals b.SiteId
                                    
                
                    //                select s
                    //           ).ToList();//context.Sites.ToList();
                output.okay = true;
                output.model = siteList;
                output.message = string.Empty;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.model = null;
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
        }

        [HttpGet]
        [Route("api/getsitebyid")]
        public Output GetSite(int siteId)
        {
            Output output = new Output();
            try
            {
                var site = context.Sites.FirstOrDefault(x => x.Id == siteId);
                output.okay = true;
                output.model = site;
                output.message = string.Empty;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.model = null;
                output.message = exception.Message;
                logger.Error(exception.Message);
            }
            return output;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (context != null)
                {
                    context.Dispose();
                }
            }
            base.Dispose(disposing);
        }
    }
}
