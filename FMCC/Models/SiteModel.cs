using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
    public class SiteModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public Nullable<decimal> Longitude { get; set; }
        public Nullable<decimal> Lattitude { get; set; }
        public Nullable<decimal> Latitude { get; set; }
        public string ImageLocation { get; set; }
        public Nullable<bool> Active { get; set; }
        public Nullable<bool> IsAlarmed { get; set; }
        public string Blocks { get; set; }
    }
}