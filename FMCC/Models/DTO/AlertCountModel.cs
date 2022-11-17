using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models.DTO
{
    public class AlertCountModel
    {
        public int BlockId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Type { get; set; }
    }
}