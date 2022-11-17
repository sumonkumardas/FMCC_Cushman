using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Fmcc.Models.EntityDataModel;

namespace Fmcc.Models.DTO
{
    public class EquipmentHistogramDTO
    {
        public string Equipment { get; set; }
        public List<TempReading> Data { get; set; }
    }
}