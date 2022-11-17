using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
    public class DynamicUIControl
    {
        public int BuildingAutoId { get; set; }
        public string BuildingId { get; set; }
        public string BuildingName { get; set; }
        public int ObjectAutoId { get; set; }
        public string ObjectId { get; set; }
        public string ObjectName { get; set; }
        public int DataFieldAutoId { get; set; }
        public string DataFieldId { get; set; }
        public string DataFieldName { get; set; }
        public int? ControlQty { get; set; }
    }
}