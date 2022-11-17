using System;
using System.Linq;
using Fmcc.Models;
using Fmcc.Extension;
using System.Net.Http;
using System.Web.Http;
using Fmcc.Models.EntityDataModel;
using System.Collections.Generic;


namespace Fmcc.Controllers
{
    [RoutePrefix("api/setupapi")]
    public class SetupApiController : ApiController
    {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private FMCCDataContext context;

        public SetupApiController()
        {
            context = new FMCCDataContext();
        }

        [HttpPost, Route("postobject")]
        public Output PostObject(ObjectModel objectItem)
        {
            Output result = new Output();
            try
            {
                Models.EntityDataModel.Object dbObj = new Models.EntityDataModel.Object();
                var count = context.Objects.Where(w => w.ObjectId == objectItem.ObjectId && w.Name == objectItem.Name).Count();
                if (count == 0)
                {
                    dbObj.Id = GetMaxObjectId() + 1;
                    dbObj.ObjectId = objectItem.ObjectId;
                    dbObj.Name = objectItem.Name;
                    dbObj.IsRaw = true;
                    dbObj.IsCompute = true;
                    context.Objects.Add(dbObj);
                    context.SaveChanges();
                    result.okay = true;
                    result.model = null;
                }
                else
                {
                    result.okay = false;
                    result.model = null;
                    result.message = "Same object exists";
                }

            }
            catch (Exception ex)
            {
                result.okay = false;
                result.model = null;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpPost, Route("updateobject")]
        public Output UpdateObject(Models.EntityDataModel.Object objectItem)
        {
            Output result = new Output();
            try
            {
                if (objectItem.Id > 0)
                {
                    var _objectItem = context.Objects.Find(objectItem.Id);
                    if (_objectItem != null)
                    {
                        _objectItem.Name = objectItem.Name;
                        _objectItem.ObjectId = objectItem.ObjectId;
                        context.SaveChanges();
                        result.okay = true;
                    }
                    else
                    {
                        result.okay = false;
                    }
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpPost, Route("deleteobject")]
        public Output DeleteObject(Models.EntityDataModel.Object objectItem)
        {
            Output result = new Output();
            try
            {
                if (objectItem != null)
                {
                    var _objectItem = context.Objects.Find(objectItem.Id);
                    if (!_objectItem.Equals(null))
                    {
                        context.Objects.Remove(_objectItem);
                        context.SaveChanges();
                        result.okay = true;
                    }
                    else
                    {
                        result.okay = false;
                    }
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpGet, Route("LoadObjectList")]
        public object LoadObjectList()
        {
            var queryString = Request.GetQueryNameValuePairs()
                    .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
            int draw = int.Parse(queryString["draw"]);
            int start = int.Parse(queryString["start"]);
            int length = int.Parse(queryString["length"]);
            string search = queryString["search.value"];

            try
            {
                var query = context.Objects;
                var dataFiltered = query.Where(w => w.ObjectId.Contains(search) || w.Name.Contains(search));
                var data = dataFiltered.OrderBy(o => o.ObjectId).Skip(start).Take(length);
                return new
                {
                    draw = draw,
                    data = data.ToList(),
                    recordsFiltered = dataFiltered.Count(),
                    recordsTotal = query.Count()
                };
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpPost, Route("postdatafield")]
        public Output PostDataField(DataField df)
        {
            Output result = new Output();
            try
            {
                var dataFieldUnit = context.DataFieldUnits.Find(int.Parse(df.Unit));
                if (dataFieldUnit != null)
                {
                    df.Unit = dataFieldUnit.Name;
                }
                else
                {
                    df.Unit = "";
                }
                df.Id = GetMaxDatafieldId() + 1;
                df.IsRaw = true;
                df.IsCompute = true;

                context.DataFields.Add(df);
                context.SaveChanges();
                result.okay = true;
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpPost, Route("updatedatafield")]
        public Output UpdateDataField(DataField df)
        {
            Output result = new Output();
            try
            {
                DataField dfd = new DataField();
                int unitId = int.Parse(df.Unit);
                if (df.Id > 0)
                {
                    var dataField = context.DataFields.Find(df.Id);
                    var dataFieldUnit = context.DataFieldUnits.Find(unitId);
                    if (dataField != null)
                    {
                        dataField.Name = df.Name;
                        dataField.Unit = dataFieldUnit == null ? null : dataFieldUnit.Name;
                        dataField.DataFieldId = df.DataFieldId;
                        context.SaveChanges();
                        result.okay = true;
                    }
                    else
                    {
                        result.okay = false;
                    }
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpPost, Route("deletedatafield")]
        public Output DeleteDataField(DataField df)
        {
            Output result = new Output();
            try
            {
                if (df.Id > 0)
                {
                    var dataField = context.DataFields.Find(df.Id);
                    if (dataField != null)
                    {
                        context.DataFields.Remove(dataField);
                        context.SaveChanges();
                        result.okay = true;
                    }
                    else
                    {
                        result.okay = false;
                    }
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpGet, Route("LoadDataFieldList")]
        public object LoadDataFieldList()
        {
            var queryString = Request.GetQueryNameValuePairs().ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);

            int draw = int.Parse(queryString["draw"]);
            int start = int.Parse(queryString["start"]);
            int length = int.Parse(queryString["length"]);
            string search = queryString["search.value"];

            try
            {

                var query = (from m in context.DataFields
                             join n in context.DataFieldUnits
                             on m.Unit equals n.Name into collection
                             from matched in collection.DefaultIfEmpty()
                             select new
                             {
                                 Id = m.Id,
                                 DataFieldId = m.DataFieldId,
                                 Name = m.Name,
                                 Type = m.Type,
                                 Unit = matched == null ? null : matched.Name,
                                 UnitId = matched == null ? 0 : matched.Id,
                                 IsRaw = m.IsRaw,
                                 IsCompute = m.IsCompute,
                                 IsActive = m.IsActive
                             }).ToList();
                var dataFiltered = query.Where(w => w.DataFieldId.Contains(search) || w.Name.Contains(search) || w.Unit.Contains(search));
                var data = dataFiltered.OrderBy(o => o.DataFieldId).Skip(start).Take(length);

                return new
                {
                    draw = draw,
                    data = data.ToList(),
                    recordsFiltered = dataFiltered.Count(),
                    recordsTotal = query.Count()
                };
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet, Route("loaddatafieldunits")]
        public object LoadDataFieldUnits()
        {
            try
            {
                var queryString = Request.GetQueryNameValuePairs().ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
                int draw = int.Parse(queryString["draw"]);
                int start = int.Parse(queryString["start"]);
                int length = int.Parse(queryString["length"]);
                string search = queryString["search.value"];

                var query = context.DataFieldUnits;
                var dataFiltered = query.Where(w => w.Name.Contains(search));
                var data = dataFiltered.OrderBy(o => o.Id).Skip(start).Take(length);
                return new
                {
                    draw = draw,
                    data = data.ToList(),
                    recordsFiltered = dataFiltered.Count(),
                    recordsTotal = query.Count()
                };
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpPost, Route("submitdatafieldunit")]
        public object SubmitDataFieldUnit(DataFieldUnit unit)
        {
            var result = new Output();
            try
            {
                var dbUnit = context.DataFieldUnits.Where(e => e.Name == unit.Name);
                if (dbUnit.Count() == 0)
                {
                    context.DataFieldUnits.Add(unit);
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    result.okay = false;
                    result.message = "Already exist.";
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpPost, Route("updatedatafieldunit")]
        public object UpdateDataFieldUnit(DataFieldUnit unit)
        {
            var result = new Output();
            try
            {
                var dbUnit = context.DataFieldUnits.Find(unit.Id);
                if (dbUnit != null)
                {
                    dbUnit.Name = unit.Name;
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    result.okay = false;
                    result.message = "Not Found.";
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpPost, Route("deletedatafieldunit")]
        public object DeleteDataFieldUnit(DataFieldUnit unit)
        {
            var result = new Output();
            try
            {
                var dbUnit = context.DataFieldUnits.Find(unit.Id);
                if (dbUnit != null)
                {
                    context.DataFieldUnits.Remove(dbUnit);
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    result.okay = false;
                    result.message = "Not Found.";
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpGet, Route("loaddatafieldunitlist")]
        public Output LoadDataFieldUnitList()
        {
            Output result = new Output();
            try
            {
                var list = context.DataFieldUnits.Select(e => new { id = e.Id, text = e.Name }).ToList();
                result.okay = true;
                result.model = list;
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpGet, Route("loadpowerdatafieldunitlist")]
        public object LoadPowerDataFieldUnitList()
        {
            try
            {
                var queryString = Request.GetQueryNameValuePairs().ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
                int draw = int.Parse(queryString["draw"]);
                int start = int.Parse(queryString["start"]);
                int length = int.Parse(queryString["length"]);
                string search = queryString["search.value"];
                var query = context.ObjectUnitMappings.Where(e => e.ObjectDataField == "OverallPowerConsumption");
                var dataFiltered = query.Where(w => w.ObjectDataField.Contains(search) || w.UnitName.Contains(search));
                var data = dataFiltered.OrderBy(o => o.ObjectDataField).Skip(start).Take(length);
                return new
                {
                    draw = draw,
                    data = data.ToList(),
                    recordsFiltered = dataFiltered.Count(),
                    recordsTotal = query.Count()
                };
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;

            }
        }

        [HttpGet, Route("loadwaterdatafieldunitlist")]
        public object LoadWaterDataFieldUnitList()
        {
            try
            {
                var queryString = Request.GetQueryNameValuePairs().ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
                int draw = int.Parse(queryString["draw"]);
                int start = int.Parse(queryString["start"]);
                int length = int.Parse(queryString["length"]);
                string search = queryString["search.value"];
                var query = context.ObjectUnitMappings.Where(e => e.ObjectDataField == "OverallWaterConsumption");
                var dataFiltered = query.Where(w => w.ObjectDataField.Contains(search) || w.UnitName.Contains(search));
                var data = dataFiltered.OrderBy(o => o.ObjectDataField).Skip(start).Take(length);
                return new
                {
                    draw = draw,
                    data = data.ToList(),
                    recordsFiltered = dataFiltered.Count(),
                    recordsTotal = query.Count()
                };
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;

            }
        }

        [HttpGet, Route("loadtempdatafieldunitlist")]
        public object LoadTempDataFieldUnitList()
        {
            try
            {
                var queryString = Request.GetQueryNameValuePairs().ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
                int draw = int.Parse(queryString["draw"]);
                int start = int.Parse(queryString["start"]);
                int length = int.Parse(queryString["length"]);
                string search = queryString["search.value"];
                var query = context.ObjectUnitMappings.Where(e => e.ObjectDataField == "Temperature");
                var dataFiltered = query.Where(w => w.ObjectDataField.Contains(search) || w.UnitName.Contains(search));
                var data = dataFiltered.OrderBy(o => o.ObjectDataField).Skip(start).Take(length);
                return new
                {
                    draw = draw,
                    data = data.ToList(),
                    recordsFiltered = dataFiltered.Count(),
                    recordsTotal = query.Count()
                };
            }
            catch (System.Exception exception)
            {
                logger.Error(exception.Message);
                return null;

            }
        }

        [HttpPost]
        [Route("submitobjectdatafieldunit")]
        public Output SubmitObjectDataFieldUnit(ObjectUnitMapping map)
        {
            Output result = new Output();
            try
            {
                if (map != null)
                {
                    var unit = context.DataFieldUnits.Find(map.UnitId);
                    if (unit != null)
                    {
                        map.UnitName = unit.Name;
                    }
                    else
                    {
                        throw new Exception("Unit is not found with unit id:" + map.UnitId);
                    }

                    var objMap = context.ObjectUnitMappings.Where(e => e.ObjectDataField == map.ObjectDataField).FirstOrDefault();
                    if (objMap == null)
                    {
                        context.ObjectUnitMappings.Add(map);
                        context.SaveChanges();
                        result.okay = true;
                    }
                    else
                    {
                        objMap.UnitId = map.UnitId;
                        objMap.UnitName = map.UnitName;
                        context.SaveChanges();
                        result.okay = true;
                    }
                }
                else
                {
                    throw new ArgumentNullException();
                }
            }
            catch (Exception exception)
            {
                result.okay = false;
                result.message = exception.Message;
                logger.Error(exception.Message);
            }
            return result;
        }

        [HttpGet, Route("loadbuildinglist")]
        public IEnumerable<Building> LoadBuildingList()
        {
            try
            {
                using (var db = new FMCCDataContext())
                {
                    return db.Buildings.ToList();
                }
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet, Route("loadtypelist")]
        public object LoadTypeList()
        {
            try
            {
                using (var db = new FMCCDataContext())
                {
                    return db.Objects.ToList();
                }
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet, Route("loadfieldlist")]
        public object LoadFieldList()
        {
            try
            {
                var list = (from m in context.DataFields
                            join n in context.DataFieldUnits
                            on m.Unit equals n.Name into collection
                            from matched in collection.DefaultIfEmpty()
                            select new
                            {
                                Id = m.Id,
                                DataFieldId = m.DataFieldId,
                                Name = m.Name,
                                Type = m.Type,
                                Unit = matched == null ? null : matched.Name,
                                UnitId = matched == null ? 0 : matched.Id,
                                IsRaw = m.IsRaw,
                                IsCompute = m.IsCompute,
                                IsActive = m.IsActive
                            }).ToList();
                return list;
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpPost, Route("SaveBuidingObjectData")]
        public object SaveBuidingObjectData(BuildingObjectData objectItem)
        {
            var result = new Output();
            try
            {
                BuildingObjectData bod = new BuildingObjectData();
                if (objectItem.BuildingFkId != 0 && objectItem.ObjectFkId != 0 && objectItem.DataFieldFkId != 0 && objectItem.RawDataFieldNumber.Value != 0)
                {
                    var df = GetDataFieldIdWithUnit(objectItem.DataFieldFkId);
                    bod.BuildingId = GetBuildingId(objectItem.BuildingFkId);
                    bod.ObjectId = GetObjectId(objectItem.ObjectFkId);
                    bod.DataFieldId = df["id"];
                    bod.DataFieldUnit = df["unit"];

                    bod.BuildingFkId = objectItem.BuildingFkId;
                    bod.ObjectFkId = objectItem.ObjectFkId;
                    bod.DataFieldFkId = objectItem.DataFieldFkId;
                    bod.RawDataFieldNumber = objectItem.RawDataFieldNumber.Value;
                    bod.ComputedDataFieldNumber = 0;
                    context.BuildingObjectDatas.Add(bod);
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpPost, Route("updatebuildingobjectdatafield")]
        public Output UpdateBuildingObjectDataField(BuildingObjectData objectItem)
        {
            Output result = new Output();
            try
            {
                var _objectItem = context.BuildingObjectDatas.Where(e => e.BuildingFkId == objectItem.BuildingFkId && e.ObjectFkId == objectItem.ObjectFkId && e.DataFieldFkId == objectItem.DataFieldFkId).FirstOrDefault();
                if (_objectItem != null)
                {
                    _objectItem.BuildingFkId = objectItem.BuildingFkId;
                    _objectItem.ObjectFkId = objectItem.ObjectFkId;
                    _objectItem.DataFieldFkId = objectItem.DataFieldFkId;
                    _objectItem.RawDataFieldNumber = objectItem.RawDataFieldNumber;
                    var df = GetDataFieldIdWithUnit(objectItem.DataFieldFkId);
                    _objectItem.DataFieldUnit = df["unit"];
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    _objectItem = new BuildingObjectData();
                    var df = GetDataFieldIdWithUnit(objectItem.DataFieldFkId);
                    _objectItem.BuildingId = GetBuildingId(objectItem.BuildingFkId);
                    _objectItem.ObjectId = GetObjectId(objectItem.ObjectFkId);
                    _objectItem.DataFieldId = df["id"];
                    _objectItem.DataFieldUnit = df["unit"];

                    _objectItem.BuildingFkId = objectItem.BuildingFkId;
                    _objectItem.ObjectFkId = objectItem.ObjectFkId;
                    _objectItem.DataFieldFkId = objectItem.DataFieldFkId;
                    _objectItem.RawDataFieldNumber = objectItem.RawDataFieldNumber.Value;
                    _objectItem.ComputedDataFieldNumber = 0;
                    context.BuildingObjectDatas.Add(_objectItem);
                    context.SaveChanges();
                    result.okay = true;
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpPost, Route("deletebuildingobjectdatafield")]
        public Output DeleteBuildingObjectDataField(BuildingObjectData objectItem)
        {
            Output result = new Output();
            try
            {
                var item = context.BuildingObjectDatas.Where(e => e.BuildingFkId == objectItem.BuildingFkId && e.ObjectFkId == objectItem.ObjectFkId && e.DataFieldFkId == objectItem.DataFieldFkId).FirstOrDefault();
                if (item != null)
                {
                    context.BuildingObjectDatas.Remove(item);
                    context.SaveChanges();
                    result.okay = true;
                }
                else
                {
                    result.okay = false;
                }
            }
            catch (Exception ex)
            {
                result.okay = false;
                result.message = ex.Message;
                logger.Error(ex.Message);
            }
            return result;
        }

        [HttpGet, Route("LoadBuildingObjectData")]
        public object LoadBuildingObjectData()
        {
            var queryString = Request.GetQueryNameValuePairs()
              .ToDictionary((keyItem) => keyItem.Key, (valueItem) => valueItem.Value);
            int draw = int.Parse(queryString["draw"]);
            int start = int.Parse(queryString["start"]);
            int length = int.Parse(queryString["length"]);
            string search = queryString["search.value"];

            try
            {
                FMCCDataContext db = new FMCCDataContext();
                var query = (from bdo in db.BuildingObjectDatas
                             join o in db.Objects on bdo.ObjectFkId equals o.Id
                             join d in db.DataFields on bdo.DataFieldFkId equals d.Id
                             join b in db.Buildings on bdo.BuildingFkId equals b.Id
                             select new Result
                             {
                                 BuildingFkId = b.Id,
                                 BuildingName = b.Name,
                                 ObjectFkId = o.Id,
                                 ObjectName = o.Name,
                                 DataFieldFkId = d.Id,
                                 DataFieldName = d.Name,
                                 DataFieldUnit = d.Unit,
                                 RawDataFieldNumber = bdo.RawDataFieldNumber.ToString(),
                                 ComputedDataFieldNumber = bdo.ComputedDataFieldNumber.ToString()
                             });
                var totalCount = query.Count();
                var filteredData = query.Where(w => w.BuildingName.Contains(search) || w.ObjectName.Contains(search) || w.DataFieldName.Contains(search) || w.DataFieldUnit.Contains(search));
                var data = filteredData.OrderBy(e => e.ObjectName).Skip(start).Take(length).ToList();
                return new
                {
                    draw = draw,
                    data = data,
                    recordsFiltered = filteredData.Count(),
                    recordsTotal = totalCount
                };
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        [HttpGet]
        [Route("object")]
        public Output ReadAllObject(int siteId)
        {
            Output output = new Output();
            try
            {
                if (true)
                {
                    int[] buildingList = context.Buildings.Where(x => x.SiteId == siteId)
                  .Select(e => e.Id)
                  .Distinct()
                  .ToArray();
                    output.model = context.BuildingObjectDatas.Where(x=>buildingList.Contains(x.BuildingFkId)).Select(e => new { id = e.ObjectFkId, text = e.ObjectId }).Distinct().ToList();
                        output.okay = true;
                }
                else
                {
                    output.okay = false;
                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
            }
            return output;
        }
        [HttpGet, Route("LoadBuildingObject")]
        public object LoadBuildingObject()
        {
            Output output = new Output();
            try
            {
                var objectList = context.Objects.Select(e => new
                {
                    Id = e.Id,
                    ObjectId = e.ObjectId,
                    ObjectName = e.Name
                }).Distinct().ToList();

                output.model = objectList;
                output.okay = true;

            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
                logger.Error(output.message);
            }
            return output;
        }

        [HttpPost]
        [Route("saveonoffobject")]
        public void saveonoffobject(ObjectOnOffMapping model)
        {
            if (model != null)
            {
                if (model.ObjectFkId > 0 && model.DataFieldFkId > 0)
                {
                    try
                    {
                        var onoffMapping =
                            context.ObjectOnOffMappings.FirstOrDefault(
                                x => x.Id==model.Id);
                        if (onoffMapping == null)
                        {
                            var onOffModel = new ObjectOnOffMapping();
                            onOffModel.ObjectFkId = model.ObjectFkId;
                            onOffModel.ObjectId = context.Objects.FirstOrDefault(x => x.Id == model.ObjectFkId).ObjectId;
                            onOffModel.ObjectName = onOffModel.ObjectId;
                            onOffModel.DataFieldFkId = model.DataFieldFkId;
                            onOffModel.DataFieldId = context.DataFields.FirstOrDefault(x => x.Id == model.DataFieldFkId).DataFieldId;
                            onOffModel.DataFieldName = onOffModel.DataFieldId;
                            onOffModel.Type = model.Type;
                            onOffModel.Thresold = model.Thresold;
                            onOffModel.OnValue = model.OnValue;
                            onOffModel.OffValue = model.OffValue;
                            context.ObjectOnOffMappings.Add(onOffModel);
                            context.SaveChanges();
                        }
                        else
                        {
                            onoffMapping.ObjectFkId = model.ObjectFkId;
                            onoffMapping.ObjectId = context.Objects.FirstOrDefault(x => x.Id == model.ObjectFkId).ObjectId;
                            onoffMapping.ObjectName = onoffMapping.ObjectId;
                            onoffMapping.DataFieldFkId = model.DataFieldFkId;
                            onoffMapping.DataFieldId = context.DataFields.FirstOrDefault(x => x.Id == model.DataFieldFkId).DataFieldId;
                            onoffMapping.DataFieldName = onoffMapping.DataFieldId;
                            onoffMapping.Type = model.Type;
                            onoffMapping.Thresold = model.Thresold;
                            onoffMapping.OnValue = model.OnValue;
                            onoffMapping.OffValue = model.OffValue;
                            context.SaveChanges();
                        }
                        
                        
                    }
                    catch (Exception ex)
                    {

                        throw;
                    }
                }
            }
        }

        [HttpPost]
        [Route("deleteonoffobject")]
        public void deleteonoffobject(ObjectOnOffMapping model)
        {
            if (model != null)
            {
                if (model.ObjectFkId > 0 && model.DataFieldFkId > 0)
                {
                    try
                    {
                        var onoffMapping =
                            context.ObjectOnOffMappings.FirstOrDefault(
                                x => x.ObjectFkId == model.ObjectFkId && x.DataFieldFkId == model.DataFieldFkId);
                        if (onoffMapping == null)
                        {
                          
                        }
                        else
                        {
                            context.ObjectOnOffMappings.Remove(onoffMapping);
                            context.SaveChanges();
                        }


                    }
                    catch (Exception ex)
                    {

                        throw;
                    }
                }
            }
        }

        [HttpGet]
        [Route("getonoffobject")]
        public ObjectOnOffMapping getonoffobject(int id)
        {
            return context.ObjectOnOffMappings.FirstOrDefault(x => x.Id == id);
        }

        [HttpGet, Route("loadonoffobjectlist")]
        public Output LoadOnOffObjectList()
        {
            Output output = new Output();
            try
            {
                var objectList = context.ObjectOnOffMappings.Select(e => new
                {
                    Id=e.Id,
                    ObjectFkId = e.ObjectFkId,
                    ObjectId = e.ObjectId,
                    ObjectName = e.ObjectName,
                    DataFieldFkId = e.DataFieldFkId,
                    DataFieldId = e.DataFieldId,
                    DataFieldName = e.DataFieldName,
                    Type=e.Type
                }).ToList();

                output.model = objectList;
                output.okay = true;

            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
                logger.Error(output.message);
            }
            return output;
        }

        [HttpPost]
        [Route("loadobjectdatafieldlist")]
        public Output LoadObjectDataFieldList(Models.EntityDataModel.Object model)
        {
            Output output = new Output();
            try
            {
                if (model != null)
                {
                    if (model.Id > 0)
                    {
                        var dataFieldList = context.BuildingObjectDatas.Where(e => e.ObjectFkId == model.Id).Select(s => new
                        {
                            id = s.DataFieldFkId,
                            text = s.DataFieldId,
                        }).Distinct().ToList();

                        output.model = dataFieldList;
                        output.okay = true;
                    }
                }
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
                logger.Error(output.message);
            }
            return output;
        }

        [HttpGet]
        [Route("onoffobjectdatafield")]
        public Output OnOffObjectDataField()
        {
            Output output = new Output();
            try
            {
                var data = context.ObjectOnOffMappings.FirstOrDefault();
                output.model = data;
                output.okay = true;
            }
            catch (Exception exception)
            {
                output.okay = false;
                output.message = exception.Message;
                logger.Error(output.message);
            }
            return output;
        }



        private int GetMaxObjectId()
        {
            try
            {
                using (var db = new FMCCDataContext())
                {
                    int maxId = db.Objects.Max(x => x.Id);
                    if (maxId == 0) maxId = 1;
                    return maxId;
                }
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return 0;
            }
        }

        private int GetMaxDatafieldId()
        {
            try
            {
                using (var db = new FMCCDataContext())
                {
                    int maxId = db.DataFields.Max(x => x.Id);
                    if (maxId == 0) maxId = 1;
                    return maxId;
                }
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return 0;
            }
        }

        private string GetObjectId(int id)
        {
            try
            {
                using (var db = new FMCCDataContext())
                {
                    Models.EntityDataModel.Object objectItem = db.Objects.FirstOrDefault(x => x.Id == id);
                    return objectItem.ObjectId;
                }

            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        private string GetBuildingId(int id)
        {
            try
            {
                using (var db = new FMCCDataContext())
                {
                    Building bi = db.Buildings.FirstOrDefault(x => x.Id == id);
                    return bi.BuildingId;
                }

            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        private string GetDataFieldId(int id)
        {
            try
            {
                using (var db = new FMCCDataContext())
                {
                    DataField df = db.DataFields.FirstOrDefault(x => x.Id == id);
                    return df.DataFieldId;
                }

            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }

        private Dictionary<string, string> GetDataFieldIdWithUnit(int id)
        {
            try
            {
                var di = new Dictionary<string, string>();
                using (var db = new FMCCDataContext())
                {
                    DataField df = db.DataFields.FirstOrDefault(x => x.Id == id);
                    di.Add("id", df.DataFieldId);
                    di.Add("unit", df.Unit);
                }
                return di;
            }
            catch (Exception exception)
            {
                logger.Error(exception.Message);
                return null;
            }
        }
    }

    public class Result
    {
        public int Id { get; set; }
        public int BuildingFkId { get; set; }
        public int ObjectFkId { get; set; }
        public int DataFieldFkId { get; set; }
        public string BuildingName { get; set; }
        public string ObjectName { get; set; }
        public string DataFieldName { get; set; }
        public string DataFieldUnit { get; set; }
        public string RawDataFieldNumber { get; set; }
        public string ComputedDataFieldNumber { get; set; }
    }
}
