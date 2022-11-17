using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
    public class BlockMapModel
    {
        public int Id { get; set; }
        public string BuildingId { get; set; }
        public Nullable<decimal> Latitude { get; set; }
        public Nullable<decimal> Longitude { get; set; }
        public Nullable<bool> IsAlarmed { get; set; }
        public string SiteName { get; set; }
    }
}