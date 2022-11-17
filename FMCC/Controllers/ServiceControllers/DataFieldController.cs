using System.Linq;
using Fmcc.Extension;
using System.Collections.Generic;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using Fmcc.Models.DTO;

namespace Fmcc.Controllers.ServiceControllers
{
    public class DataFieldController : ApiController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private readonly FMCCDataContext context;

        public DataFieldController()
        {
            context = new FMCCDataContext();
        }

        [Route("api/alldatafield")]
        public List<ObjectDataFieldDTO> GetAll()
        {
            using (var db = new FMCCDataContext())
            {
                var obj = (from o in db.DataFields
                           select new ObjectDataFieldDTO
                           {
                               Id = o.Id,
                               Name = o.Name
                           }).ToList();
                return obj;
            }
        }

        [Route("api/alldatafield/{objectId}")]
        public List<ObjectDataFieldDTO> GetAllById(int objectId)
        {
            using (var db = new FMCCDataContext())
            {
                var obj = (from o in db.BuildingObjectDatas
                           where (o.ObjectFkId == objectId)
                           select new ObjectDataFieldDTO
                           {
                               Id = o.DataFieldFkId,
                               Name = o.DataFieldId
                           }).ToList();
                return obj;
            }
        }

        public object Post(DataFieldModel dataField)
        {
            try
            {
                if (string.IsNullOrEmpty(dataField.Unit))
                {
                    return context.BuildingObjectDatas.Where(e => e.BuildingId == dataField.BlockId && e.ObjectId == dataField.ObjectId).Select(e => new
                    {
                        id = e.DataFieldId,
                        text = e.DataFieldId
                    }).Distinct().ToList();
                }
                else
                {
                    return context.BuildingObjectDatas.Where(e => e.BuildingId == dataField.BlockId && e.ObjectId == dataField.ObjectId && e.DataFieldUnit == dataField.Unit).Select(e => new
                    {
                        id = e.DataFieldId,
                        text = e.DataFieldId
                    }).Distinct().ToList();
                }
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;

            }


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
