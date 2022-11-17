using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models.DTO
{
    public class AMRDataBlockView
    {
        public long RN { get; set; }
        public string bId { get; set; }
        public double y { get; set; }
        public string color { get; set; }
        public Nullable<double> GFA { get; set; }
        public Nullable<int> BedNo { get; set; }
        public long x { get; set; }
        public double low { get; set; }
        public double high { get; set; }
        public double prevY { get; set; }
    }
}