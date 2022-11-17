using System;

namespace Fmcc.Extension
{
  public class ChartDataModel
  {    
    public string DatePart { get; set; }
    public string ObjectId { get; set; }
    public string BuildingId { get; set; }

    public string DataFieldId { get; set; }
    public DateTime SDateTime { get; set; }
    public DateTime EDateTime { get; set; }
    
  }
}