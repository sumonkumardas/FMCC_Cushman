using System;

namespace Fmcc.Extension
{
  public class DateTimeInterval
  {
    private PeriodRange dtInterval;
    public DateTimeInterval()
    {
      dtInterval = new PeriodRange();
    }
    public DateTimeInterval(DateTime now)
    {
      dtInterval = new PeriodRange(now);
    }


    public PeriodRange Hourly
    {
      get
      {
        return dtInterval;
      }
    }
    public PeriodRange Daily { get; set; }
    public PeriodRange Weekly { get; set; }
    public PeriodRange Monthly { get; set; }
    public PeriodRange Yearly { get; set; }
  }
}