using System.Linq;
using Fmcc.Extension;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using EntityFramework.Utilities;
using System.Collections.Generic;
using System.Web.Http.Description;

namespace Fmcc.Controllers
{
    public class TempReadingClientServiceController : ApiController
    {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        [Route("api/tempreadingclientservice")]
        public void Post(List<TempReading> tempReadingList)
        {
            try
            {
                using (var db = new FMCCDataContext())
                {
                    EFBatchOperation.For(db, db.TempReadings).InsertAll(tempReadingList);
                }
            }
          catch (System.Exception exception)
            {
                logger.Error(exception.Message);
            }
        }

        [Route("api/tempreadingclientservice/{buildingId}")]
        [ResponseType(typeof(TempReading))]
        public IEnumerable<DynamicUIControl> Get(string buildingId)
        {
            IEnumerable<DynamicUIControl> obj = null;
            try
            {
                using (var db = new FMCCDataContext())
                {
                    obj = (from b in db.Buildings
                           join bodf in db.BuildingObjectDatas on b.Id equals bodf.BuildingFkId
                           join o in db.Objects on bodf.ObjectFkId equals o.Id
                           join df in db.DataFields on bodf.DataFieldFkId equals df.Id
                           //  join bodf in db.BuildingObjectDatas on new { aa = b.Id, bb = o.Id, cc = df.Id } equals new { aa = bodf.BuildingFkId, bb = bodf.ObjectFkId, cc = bodf.DataFieldFkId }
                           where b.BuildingId == buildingId && o.IsRaw == true && df.IsRaw == true && bodf.RawDataFieldNumber != 0
                           select new DynamicUIControl
                           {
                               BuildingAutoId = b.Id,
                               BuildingId = b.BuildingId,
                               BuildingName = b.Name,
                               ObjectAutoId = o.Id,
                               ObjectId = o.ObjectId,
                               ObjectName = o.Name,
                               DataFieldAutoId = df.Id,
                               DataFieldId = df.DataFieldId,
                               DataFieldName = df.Name,
                               ControlQty = bodf.RawDataFieldNumber,
                           }).ToList().OrderBy(x => x.ObjectId).ThenBy(x => x.DataFieldId);
                }
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
            }
            return obj;
        }
    }
}
