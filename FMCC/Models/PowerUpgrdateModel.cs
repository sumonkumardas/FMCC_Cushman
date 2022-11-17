using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
    public class PowerUpgrdateModel
    {
        public int BuildingFkId { get; set; }
        public string BuildingId { get; set; }
        public decimal TempDifference { get; set; }
        public decimal DiffPercentage { get; set; }
    }
}