using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Models
{
    using System.Configuration;

    public class AppSettings
    {
        public string WorkingPeriodStart
        {
            get
            {
                return ConfigurationManager.AppSettings["WorkingPeriodStart"];

            }
        }
        public string WorkingPeriodEnd
        {
            get
            { 
                return ConfigurationManager.AppSettings["WorkingPeriodEnd"];

            }
        }

        public bool TemperatureBasedHistogram
        {
            get
            {
                Boolean data;
                Boolean.TryParse(ConfigurationManager.AppSettings["TemperatureBasedHistogram"], out data);
                return data;

            }
        }

        public double TemperatureThreshold
        {
            get
            {
                double data;
                double.TryParse(ConfigurationManager.AppSettings["TemperatureThreshold"], out data);
                return data;

            }
        }

        public string TemperatureUnit
        {
            get
            {
                return ConfigurationManager.AppSettings["TemperatureUnit"];

            }
        }

        public bool ShowOffStatus
        {
            get
            {
                Boolean data;
                Boolean.TryParse(ConfigurationManager.AppSettings["ShowOffStatus"], out data);
                return data;

            }
        }

    }
}