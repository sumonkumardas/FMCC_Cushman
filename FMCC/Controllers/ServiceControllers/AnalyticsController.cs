using Fmcc.Models;
using Fmcc.Models.EntityDataModel;
using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http;

namespace Fmcc.Controllers.ServiceControllers
{
    [RoutePrefix("api/analytics")]
    public class AnalyticsController : ApiController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private FMCCDataContext context;

        public AnalyticsController()
        {
            context = new FMCCDataContext();
        }

        [HttpGet]
        [Route("blocks")]
        public Output blocks()
        {
            Output result = new Output();
            try
            {
                int siteId = 1;
                var queryString = Request.GetQueryNameValuePairs()
                .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);

                if (queryString.ContainsKey("siteId"))
                {
                    if (!string.IsNullOrEmpty(queryString["siteId"]))
                    {
                        siteId = int.Parse(queryString["siteId"]);
                    }
                }
                result.model = context.Buildings.Where(x=>x.SiteId==siteId).Select(e => new { id = e.BuildingId, text = e.Name }).ToList();
                result.okay = true;
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.okay = false;
                result.message = ex.Message;
            }
            return result;
        }

        [HttpGet]
        [Route("objects")]
        public Output objects()
        {
            Output result = new Output();
            try
            {
                result.model = context.Objects.Select(e => new { id = e.ObjectId, text = e.Name }).ToList();
                result.okay = true;
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.okay = false;
                result.message = ex.Message;
            }
            return result;
        }

        [HttpGet]
        [Route("datafields")]
        public Output dataFields()
        {
            Output result = new Output();
            try
            {
                result.model = context.DataFields.Select(e => new { id = e.DataFieldId, text = e.Name }).ToList();
                result.okay = true;
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                result.okay = false;
                result.message = ex.Message;
            }
            return result;
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
