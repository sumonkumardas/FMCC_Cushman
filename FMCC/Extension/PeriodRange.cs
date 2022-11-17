
namespace Fmcc.Extension
{
    using System;
    using System.Collections.Generic;

    public class PeriodRange
    {
        public PeriodRange()
        {
            _now = DateTime.Now;
            _day = _now.Day;
            _year = _now.Year;
            _month = _now.Month;
            _hour = _now.Hour;
            _minute = _now.Minute;
            _second = _now.Second;
        }
        public PeriodRange(DateTime now)
        {
            _now = now;
            _day = _now.Day;
            _year = _now.Year;
            _month = _now.Month;
            _hour = _now.Hour;
            _minute = _now.Minute;
            _second = _now.Second;
        }
        public PeriodRange(int offset, int type)
        {
            _now = DateTime.Now;
            if (type == 1)
            {
                _now = _now.AddDays(offset);
            }
            else if (type == 2)
            {
                _now = _now.AddDays((7 * offset));
            }
            else if (type == 3)
            {
                _now = _now.AddMonths(offset);
            }
            else
            {
                _now = _now.AddYears(offset);
            }
            _day = _now.Day;
            _year = _now.Year;
            _month = _now.Month;
            _hour = _now.Hour;
            _minute = _now.Minute;
            _second = _now.Second;

        }

        //variables
        private int _day;
        private int _year;
        private int _month;
        private int _hour;
        private int _minute;
        private int _second;
        private DateTime _now = DateTime.Now;

        public DateTimeRange SoFarToday
        {
            get
            {
                DateTime upperBound;
                if (_hour == 0)
                {
                    upperBound = _now.Date.AddMinutes(_minute).AddSeconds(_second);
                }
                else
                {
                    upperBound = _now.Date.AddHours(_hour).AddSeconds(-1);
                }
                return new DateTimeRange()
                {
                    LowerBound = _now.Date,
                    UpperBound = upperBound
                };
            }
        }
        public DateTimeRange SoFarThisWeek
        {
            get
            {
                DateTime upperBound;
                if (_hour == 0)
                {
                    upperBound = _now.Date.AddMinutes(_minute).AddSeconds(_second);
                }
                else
                {
                    upperBound = _now.Date.AddHours(_hour).AddSeconds(-1);
                }
                return new DateTimeRange()
                {
                    LowerBound = _now.Date.StartOfWeek(DayOfWeek.Monday),
                    UpperBound = upperBound
                };
            }
        }
        public DateTimeRange SoFarThisMonth
        {
            get
            {
                DateTime upperBound;
                if (_hour == 0)
                {
                    upperBound = _now.Date.AddMinutes(_minute).AddSeconds(_second);
                }
                else
                {
                    upperBound = _now.Date.AddHours(_hour).AddSeconds(-1);
                }
                return new DateTimeRange()
                {
                    LowerBound = new DateTime(_year, _month, 1, 0, 0, 0),
                    UpperBound = upperBound
                };
            }
        }
        public DateTimeRange SoFarThisYear
        {
            get
            {
                DateTime upperBound;
                if (_hour == 0)
                {
                    upperBound = _now.Date.AddMinutes(_minute).AddSeconds(_second);
                }
                else
                {
                    upperBound = _now.Date.AddHours(_hour).AddSeconds(-1);
                }
                return new DateTimeRange()
                {
                    LowerBound = _now.Date.AddMonths(-(_month - 1)).AddDays(-(_day - 1)),
                    UpperBound = upperBound
                };
            }
        }

        public DateTimeRange Yesterday
        {
            get
            {
                return new DateTimeRange()
                {
                    LowerBound = _now.Date.AddDays(-1),
                    UpperBound = _now.Date.AddSeconds(-1)
                };
            }
        }
        public DateTimeRange LastWeek
        {
            get
            {
                return new DateTimeRange()
                {
                    LowerBound = _now.StartOfWeek(DayOfWeek.Monday).AddDays(-7),
                    UpperBound = _now.StartOfWeek(DayOfWeek.Monday).AddSeconds(-1)

                };
            }
        }
        public DateTimeRange LastMonth
        {
            get
            {
                return new DateTimeRange()
                {
                    LowerBound = new DateTime(_year, _month, 1, 0, 0, 0).AddMonths(-1),
                    UpperBound = new DateTime(_year, _month, 1, 0, 0, 0).AddSeconds(-1)
                };
            }
        }
        public DateTimeRange LastYear
        {
            get
            {
                return new DateTimeRange()
                {
                    LowerBound = _now.Date.AddMonths(-(_month - 1)).AddDays(-(_day - 1)).AddYears(-1),
                    UpperBound = _now.Date.AddMonths(-(_month - 1)).AddDays(-(_day - 1)).AddSeconds(-1)
                };
            }
        }

        public DateTimeRange Today
        {
            get
            {
                return new DateTimeRange()
                {
                    LowerBound = _now.Date,
                    UpperBound = _now.Date.AddHours(23).AddMinutes(59).AddSeconds(59)
                };
            }
        }
        public DateTimeRange ThisWeek
        {
            get
            {
                return new DateTimeRange()
                {
                    LowerBound = _now.Date.StartOfWeek(DayOfWeek.Monday),
                    UpperBound = _now.Date.StartOfWeek(DayOfWeek.Monday).AddDays(7).AddSeconds(-1)
                };
            }
        }
        public DateTimeRange ThisMonth
        {
            get
            {
                return new DateTimeRange()
                {
                    LowerBound = new DateTime(_year, _month, 1, 0, 0, 0),
                    UpperBound = new DateTime(_year, _month, 1, 0, 0, 0).AddMonths(1).AddSeconds(-1)
                };
            }
        }
        public DateTimeRange ThisYear
        {
            get
            {
                return new DateTimeRange()
                {
                    LowerBound = _now.Date.AddMonths(-(_month - 1)).AddDays(-(_day - 1)),
                    UpperBound = _now.Date.AddMonths(-(_month - 1)).AddDays(-(_day - 1)).AddYears(1).AddSeconds(-1)
                };
            }
        }

        public DateTimeRange SoFarYesterday
        {
            get
            {
                DateTime upperBound;
                if (_hour == 0)
                {
                    upperBound = _now.AddDays(-1).Date.AddMinutes(_minute).AddSeconds(_second);
                }
                else
                {
                    upperBound = _now.AddDays(-1).Date.AddHours(_hour).AddSeconds(-1);
                }
                return new DateTimeRange()
                {
                    LowerBound = _now.AddDays(-1).Date,
                    UpperBound = upperBound
                };
            }
        }
        public DateTimeRange SoFarLastWeek
        {
            get
            {
                DateTime upperBound;
                double dif = (_now.Date - _now.Date.StartOfWeek(DayOfWeek.Monday)).TotalDays;

                if (_hour == 0)
                {
                    upperBound = _now.Date.StartOfWeek(DayOfWeek.Monday).AddDays(-7 + dif).AddMinutes(_minute).AddSeconds(_second);
                }
                else
                {
                    upperBound = _now.Date.StartOfWeek(DayOfWeek.Monday).AddDays(-7 + dif).AddHours(_hour).AddSeconds(-1);
                }
                return new DateTimeRange()
                {
                    LowerBound = _now.Date.StartOfWeek(DayOfWeek.Monday).AddDays(-7),
                    UpperBound = upperBound
                };
            }
        }
        public DateTimeRange SoFarLastMonth
        {
            get
            {
                DateTime upperBound;
                if (_hour == 0)
                {
                    upperBound = _now.AddMonths(-1).Date.AddMinutes(_minute).AddSeconds(_second);
                }
                else
                {
                    upperBound = _now.AddMonths(-1).Date.AddHours(_hour).AddSeconds(-1);
                }
                return new DateTimeRange()
                {
                    LowerBound = new DateTime(_year, _month, 1, 0, 0, 0).AddMonths(-1),
                    UpperBound = upperBound
                };
            }
        }
        public DateTimeRange SoFarLastYear
        {
            get
            {
                DateTime upperBound;
                if (_hour == 0)
                {
                    upperBound = _now.AddYears(-1).Date.AddMinutes(_minute).AddSeconds(_second);
                }
                else
                {
                    upperBound = _now.AddYears(-1).Date.AddHours(_hour).AddSeconds(-1);
                }
                return new DateTimeRange()
                {
                    LowerBound = new DateTime(_year - 1, 1, 1, 0, 0, 0),
                    UpperBound = upperBound
                };
            }
        }

        public static Range GetRange(int offset, string duration)
        {
            Range range = new Range();
            DateTime justNow = DateTime.Now;

            if (offset == 0)
            {
                switch (duration)
                {
                    case "dd":
                        if (justNow.Hour == 0)
                        {
                            range.To = justNow.Date.AddMinutes(justNow.Minute).AddSeconds(justNow.Second);
                        }
                        else
                        {
                            range.To = justNow.Date.AddHours(justNow.Hour).AddSeconds(-1);
                        }
                        range.From = justNow.Date;
                        break;
                    case "ww":
                        if (justNow.Hour == 0)
                        {
                            range.To = justNow.Date.AddMinutes(justNow.Minute).AddSeconds(justNow.Second);
                        }
                        else
                        {
                            range.To = justNow.Date.AddHours(justNow.Hour).AddSeconds(-1);
                        }
                        range.From = justNow.Date.StartOfWeek(DayOfWeek.Monday);
                        break;
                    case "mm":
                        if (justNow.Hour == 0)
                        {
                            range.To = justNow.Date.AddMinutes(justNow.Minute).AddSeconds(justNow.Second);
                        }
                        else
                        {
                            range.To = justNow.Date.AddHours(justNow.Hour).AddSeconds(-1);
                        }
                        range.From = new DateTime(justNow.Year, justNow.Month, 1, 0, 0, 0);
                        break;
                    case "yy":
                        if (justNow.Hour == 0)
                        {
                            range.To = justNow.Date.AddMinutes(justNow.Minute).AddSeconds(justNow.Second);
                        }
                        else
                        {
                            range.To = justNow.Date.AddHours(justNow.Hour).AddSeconds(-1);
                        }
                        range.From = justNow.Date.AddMonths(-(justNow.Month - 1)).AddDays(-(justNow.Day - 1));
                        break;
                    default:
                        break;
                }
            }
            else
            {
                switch (duration)
                {
                    case "dd":
                        range.From = justNow.AddDays(offset).Date;
                        range.To = range.From.AddDays(1).AddSeconds(-1);
                        break;
                    case "ww":
                        range.From = justNow.StartOfWeek(DayOfWeek.Monday).AddDays(7 * offset).Date;
                        range.To = range.From.AddDays(7).AddSeconds(-1);
                        break;
                    case "mm":
                        range.From = new DateTime(justNow.Year, justNow.Month, 1, 0, 0, 0);
                        range.From = range.From.AddMonths(offset).Date;
                        range.To = range.From.AddMonths(1).AddSeconds(-1);
                        break;
                    case "yy":
                        range.From = new DateTime(justNow.Year, 1, 1, 0, 0, 0);
                        range.From = range.From.AddYears(offset).Date;
                        range.To = range.From.AddYears(1).Date.AddSeconds(-1);
                        break;
                    default:
                        break;
                }
            }
            return range;
        }

    }

    public static class StringExtensions
    {
        public static bool ContainsAny(this string str, params string[] values)
        {
            if (!string.IsNullOrEmpty(str) || values.Length > 0)
            {
                foreach (string value in values)
                {
                    if (str.Contains(value))
                        return true;
                }
            }

            return false;
        }
    }
}