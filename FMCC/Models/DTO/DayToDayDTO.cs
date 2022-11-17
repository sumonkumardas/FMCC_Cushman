using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models.DTO
{
    public class DayToDayDTO
    {
        public string Object { get; set; }
        public string DataField { get; set; }
        public List<List<double?>> DataOne { get; set; }
        public List<List<double?>> DataTwo { get; set; }
    }
}