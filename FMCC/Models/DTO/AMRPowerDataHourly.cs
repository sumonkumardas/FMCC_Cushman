using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models.DTO
{
    public class AMRPowerDataHourly
    {
        public int? bId { get; set; }
        public double y { get; set; }
        public double TotalPowerConsumptionLast { get; set; }
        public double LastPeak { get; set; }
        public double LastAverage { get; set; }
    }
}