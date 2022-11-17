using System.Linq;
using Fmcc.Extension;
using System.Collections.Generic;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using Fmcc.Models.DTO;

namespace Fmcc.Controllers.ServiceControllers
{
    public class ObjectController : ApiController
    {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private readonly FMCCDataContext context;

        public ObjectController()
        {
            context = new FMCCDataContext();
        }

        [Route("api/allobject")]
        public List<ObjectDataFieldDTO> GetAll()
        {
            using (var db = new FMCCDataContext())
            {
                var obj = (from o in db.Objects
                          select new ObjectDataFieldDTO
                          {
                             Id = o.Id,
                             Name = o.Name
                          }).ToList();
                return obj;
            }
        }

        public object Get(string id)
        {
            try
            {
                var model = context.BuildingObjectDatas.Where(e => e.BuildingId == id).Select(e => new
                {
                    id = e.ObjectId,
                    text = e.ObjectId
                }).Distinct().ToList();

                return model;
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
           
        }

        public object Post(DataFieldModel dataField)
        {
            try
            {
                if (string.IsNullOrEmpty(dataField.Unit))
                {
                    return context.BuildingObjectDatas.Where(e => e.BuildingId == dataField.BlockId).Select(e => new
                    {
                        id = e.ObjectId,
                        text = e.ObjectId
                    }).Distinct().ToList();
                }
                else
                {
                    return context.BuildingObjectDatas.Where(e => e.BuildingId == dataField.BlockId && e.DataFieldUnit == dataField.Unit).Select(e => new
                    {
                        id = e.ObjectId,
                        text = e.ObjectId
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