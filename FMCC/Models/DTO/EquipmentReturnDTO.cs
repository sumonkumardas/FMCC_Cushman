using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models.DTO
{
    public class EquipmentReturnDTO
    {
        public string Block { get; set; }
        public string OperatingStart { get; set; }
        public string OperatingEnd { get; set; }
        public Boolean ShowOffStatus { get; set; }
        public List<EquipmentHistogramDTO> EquipmentData { get; set; }
    }
}