using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
  public class FilterViewModel
  {
    public string BuildingId { get; set; }
    public string ObjectId { get; set; }
    public string DataFieldId { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
  }
}