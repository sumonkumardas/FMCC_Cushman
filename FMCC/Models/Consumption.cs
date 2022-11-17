using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
  public class WaterConsumption
  {
    public WaterConsumption()
    {
      Individual = new List<Pair>();
    }
    public Overall Overall { get; set; }
    public List<Pair> Individual { get; set; }
  }

  public class Pair
  {
    public string Name { get; set; }
    public string Value { get; set; }
  }

  public class Consumption
  {

    public Overall Overall { get; set; }
    public double Total { get; set; }
    public double Forecast { get; set; }
    public Efficient HourlyMostEfficient { get; set; }
    public Efficient HourlyLeastEfficient { get; set; }
    public Efficient WeeklyMostEfficient { get; set; }
    public Efficient WeeklyLeastEfficient { get; set; }
    public Efficient MonthlyMostEfficient { get; set; }
    public Efficient MonthlyLeastEfficient { get; set; }
    public Efficient YearlyMostEfficient { get; set; }
    public Efficient YearlyLeastEfficient { get; set; }

    public List<Individual> Individual { get; set; }
  }

  public class Overall
  {
    public List<Hourly> Hourly { get; set; }
    public List<Weekly> Weekly { get; set; }
    public List<Monthly> Monthly { get; set; }
    public List<Yearly> Yearly { get; set; }
  }

  public class Hourly
  {
    public int Level { get; set; }
    public double Value { get; set; }
    public double Average { get; set; }
  }

  public class Weekly
  {
    public int? Level { get; set; }
    public double Value { get; set; }
    public double Average { get; set; }
  }

  public class Monthly
  {
    public int Level { get; set; }
    public double Value { get; set; }
    public double Average { get; set; }
  }

  public class Yearly
  {
    public int? Level { get; set; }
    public double Value { get; set; }
    public double Average { get; set; }
  }

  public class Individual
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
    public double? HourlyLastAverage { get; set; }
    public double? WeeklyLastAverage { get; set; }
    public List<Hourly> Hourly { get; set; }
    public List<Weekly> Weekly { get; set; }
    public List<Monthly> Monthly { get; set; }
    public List<Yearly> Yearly { get; set; }
  }

  public class Efficient
  {
    public double Value { get; set; }
    public string BlockName { get; set; }
    public string ViewValue { get; set; }
  }

  public class DataFieldModel
  {
    public string BlockId { get; set; }
    public string Unit { get; set; }
    public string ObjectId { get; set; }
  }
}