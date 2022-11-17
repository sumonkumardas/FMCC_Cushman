using System;
using System.Linq;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using System.Collections.Generic;
using System.Web.Http.Description;
using Fmcc.Models;
using Fmcc.Models.DTO;

namespace Fmcc.Controllers
{
    public class BuildingController : ApiController
    {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private FMCCDataContext context;

        public BuildingController()
        {
            context = new FMCCDataContext();
        }

        [Route("api/building")]
        [ResponseType(typeof(Building))]
        public IEnumerable<Building> GetAll()
        {
            IEnumerable<Building> buildings = null;
            try
            {
                buildings = (from b in  context.Buildings
                             select b ).ToList();
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);

            }
            return buildings;
        }

        [HttpGet]
        [Route("getblocks")]
        public Output GetBlocks(int siteId)
        {
            Output output = new Output();
            try
            {
                List<Building> buildingList = context.Buildings.Where(x=>x.SiteId==siteId).ToList();
                output.okay = true;
                output.message = string.Empty;
                output.model = buildingList;

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
        [Route("api/sites")]
        public List<SiteDTO> GetAllSite()
        {
            List<SiteDTO> sites = new List<SiteDTO>();

            try
            {
                //sites = (from s in context.Sites
                //         select new SiteDTO
                //         {
                //             Name = s.Name,
                //             Address = s.Address
                //         }).ToList();
                return null;
            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
            }

            return sites;
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
