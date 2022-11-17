using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Utility
{
    public class AllEnums
    {
        public enum ReportType
        {
            TotalPowerConsumption=1,
            TotalWaterConsumption=2,
            AnyTemperaturePoint=3,
            AnyEquipment=4,
            SinglePoint=5
        }

        public enum AlertCondition
        {
            Above = 1,
            Below = 2
        }

        public enum ObjectValues
        {
            TotalPowerConsumption = -99,
            TotalWaterConsumption = -98,
            AnyTemperaturePoint = -97,
            AnyEquipment = -96,
            SinglePoint = -95
        };
    }
}