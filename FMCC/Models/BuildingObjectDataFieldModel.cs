namespace Fmcc.Extension
{
  public class BuildingObjectDataFieldModel
  {
    public int ObjectFkId { get; set; }
    public int BuildingFkId { get; set; }
    public int DataFieldFkId { get; set; }

    public string ObjectId { get; set; }
    public string BuildingId { get; set; }
    public string DataFieldId { get; set; }
  }
}