using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models.DTO
{
    public class SingleDateTwoDataPointDTO
    {
        public string ObjectOne { get; set; }
        public string DataFieldOne { get; set; }
        public List<List<double?>> DataOne { get; set; }
        public string ObjectTwo { get; set; }
        public string DataFieldTwo { get; set; }
        public List<List<double?>> DataTwo { get; set; }
    }
}