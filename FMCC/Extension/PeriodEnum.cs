using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
  public enum PeriodEnum
  {
    ThisDay = 100,
    ThisWeek = 200,
    ThisMonth = 300,
    ThisYear = 400,

    LastDay = -101,
    LastWeek = -201,
    LastMonth = -301,
    LastYear = -401,

    NextDay = 101,
    NextWeek = 201,
    NextMonth = 301,
    NextYear = 401,

    SoFarThisDay = 1000,
    SoFarThisWeek = 2000,
    SoFarThisMonth = 3000,
    SoFarThisYear = 4000,

    SoFarLastDay = -1001,
    SoFarLastWeek = -2001,
    SoFarLastMonth = -3001,
    SoFarLastYear = -40001,

    SoFarNextDay = 1001,
    SoFarNextWeek = 2001,
    SoFarNextMonth = 3001,
    SoFarNextYear = 4001,
  }
}