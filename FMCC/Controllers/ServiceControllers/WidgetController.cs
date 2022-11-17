using System;
using System.Linq;
using Fmcc.Extension;
using System.Web.Http;
using System.Data.Entity;
using Fmcc.Models.EntityDataModel;
using System.Collections.Generic;


namespace Fmcc.Controllers.ServiceControllers
{
    [RoutePrefix("api/widget")]
    public class WidgetController : ApiBaseController
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private readonly FMCCDataContext context;

        public WidgetController()
        {
            context = new FMCCDataContext();
        }

        [HttpPost]
        [Route("Read")]
        public object Get(Preset widget)
        {
            int userId = 1;
            List<Preset> list = new List<Preset>();
            if (widget != null && widget.id > 0)
            {
                try
                {
                    list = context.DashboardMenuPresets.Where(w => w.UserFkId == userId && w.MenuFkId == widget.id).OrderBy(o => o.Id)
                        .Select(s => new Preset
                        {
                            id = s.Id,
                            order = s.Order,

                            menuId = s.MenuId,
                            userId = s.UserId,

                            objectId = s.ObjectId,
                            objectText = s.ObjectText,

                            dateFlag = s.DateFlag,
                            dateFlagText = s.DateFlagText,

                            blockId = s.BlockId,
                            blockText = s.BlockText,

                            chartType = s.ChartType,
                            chartTitle = s.ChartTitle,
                            chartTypeText = s.ChartTypeText,

                            dataFieldId = s.DataFieldId,
                            dataFieldText = s.DataFieldText,

                            unit = context.DataFields.Where(e => e.DataFieldId == s.DataFieldId).FirstOrDefault().Unit.Trim(),

                            displayProfile = s.DisplayProfile,

                            objectToCompareId = s.ObjectToCompareId,
                            objectToCompareText = s.ObjectToCompareText,

                            dataFieldToCompareId = s.DataFieldToCompareId,
                            dataFieldToCompareText = s.DataFieldToCompareText,

                            RATemperature = s.RATemperature,
                            ValveOutput = s.ValveOutput,
                            ThresholdRangeFrom = s.ThresholdRangeFrom,
                            ThresholdRangeTo = s.ThresholdRangeTo,
                            TemperatureSetPoint = s.TemperatureSetPoint


                        }).ToList();
                }
                catch (System.Exception exception)
                {
                    logger.Error(exception.Message);

                }
            }
            return list;
        }

        [HttpPost]
        [Route("Update")]
        public object Update(Preset widget)
        {
            if (widget.id > 0)
            {
                try
                {
                    var preset = context.DashboardMenuPresets.Find(widget.id);

                    if (!string.IsNullOrEmpty(widget.displayProfile) && widget.displayProfile == "plain")
                    {
                        preset.ObjectToCompareId = null;
                        preset.ObjectToCompareText = null;
                        preset.DataFieldToCompareId = null;
                        preset.DataFieldToCompareText = null;
                        preset.RATemperature = null;
                        preset.ValveOutput = null;
                        preset.ThresholdRangeFrom = null;
                        preset.ThresholdRangeTo = null;
                        preset.TemperatureSetPoint = null;
                        preset.ChartType = widget.chartType;
                        preset.DataFieldId = widget.dataFieldId;
                    }
                    else if (!string.IsNullOrEmpty(widget.displayProfile) && widget.displayProfile == "temperature")
                    {
                        preset.ChartType = null;
                        preset.RATemperature = null;
                        preset.ValveOutput = null;
                        preset.ThresholdRangeFrom = null;
                        preset.ThresholdRangeTo = null;
                        preset.TemperatureSetPoint = null;
                        preset.DataFieldId = widget.dataFieldId;
                        preset.ObjectToCompareId = widget.objectToCompareId;
                        preset.ObjectToCompareText = widget.objectToCompareText;
                        preset.DataFieldToCompareId = widget.dataFieldToCompareId;
                        preset.DataFieldToCompareText = widget.dataFieldToCompareText;

                    }
                    else if (!string.IsNullOrEmpty(widget.displayProfile) && widget.displayProfile == "ahu")
                    {
                        preset.ChartType = null;
                        preset.DataFieldId = null;
                        preset.ObjectToCompareId = null;
                        preset.ObjectToCompareText = null;
                        preset.DataFieldToCompareId = null;
                        preset.DataFieldToCompareText = null;
                        preset.RATemperature = widget.RATemperature;
                        preset.ValveOutput = widget.ValveOutput;
                        preset.ThresholdRangeFrom = widget.ThresholdRangeFrom;
                        preset.ThresholdRangeTo = widget.ThresholdRangeTo;
                        preset.TemperatureSetPoint = widget.TemperatureSetPoint;

                    }
                    else
                    {
                        preset.ChartType = null;
                        preset.ObjectToCompareId = null;
                        preset.ObjectToCompareText = null;
                        preset.DataFieldToCompareId = null;
                        preset.DataFieldToCompareText = null;
                        preset.RATemperature = null;
                        preset.ValveOutput = null;
                        preset.ThresholdRangeFrom = null;
                        preset.ThresholdRangeTo = null;
                        preset.TemperatureSetPoint = null;
                    }
                    preset.BlockId = widget.blockId;
                    preset.ObjectId = widget.objectId;
                    preset.DateFlag = widget.dateFlag;
                    preset.ChartTitle = widget.chartTitle;
                    preset.DisplayProfile = widget.displayProfile;
                    context.SaveChanges();
                }
                catch (System.Exception exception)
                {
                    logger.Error(exception.Message);

                }
            }
            return new object();
        }

        [HttpPost]
        [Route("Create")]
        public object Post(Preset widget)
        {
            var model = new DashboardMenuPreset();

            try
            {
                model.UserId = UserInfo.Id.ToString();
                model.UserFkId = UserInfo.Id;
                model.MenuId = widget.menuId;
                model.MenuFkId = widget.menuFkId;
                model.BlockId = widget.blockId;
                model.ObjectId = widget.objectId;
                model.DateFlag = widget.dateFlag;
                model.ChartType = widget.chartType;
                model.DataFieldId = widget.dataFieldId;
                model.DisplayProfile = widget.displayProfile;
                model.ChartType = widget.chartType;
                model.ChartTitle = widget.chartTitle;
                model.ChartTypeText = widget.chartTypeText;
                model.ObjectToCompareId = widget.objectToCompareId;
                model.ObjectToCompareText = widget.objectToCompareText;
                model.DataFieldToCompareId = widget.dataFieldToCompareId;
                model.DataFieldToCompareText = widget.dataFieldToCompareText;
                model.RATemperature = widget.RATemperature;
                model.ValveOutput = widget.ValveOutput;
                model.ThresholdRangeFrom = widget.ThresholdRangeFrom;
                model.ThresholdRangeTo = widget.ThresholdRangeTo;
                model.TemperatureSetPoint = widget.TemperatureSetPoint;
                context.DashboardMenuPresets.Add(model);
                context.SaveChanges();
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);

            }
            return new { id = model.Id };
        }

        [HttpPost]
        [Route("Remove")]
        public object Remove(Preset widget)
        {
            if (widget != null && widget.id > 0)
            {
                try
                {
                    var menuItem = context.DashboardMenuPresets.Find(widget.id);
                    context.DashboardMenuPresets.Remove(menuItem);
                    context.SaveChanges();
                }
                catch (System.Exception exception)
                {
                    logger.Error(exception.Message);

                }
            }
            return new object();
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
