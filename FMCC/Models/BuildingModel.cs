using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
    public class BuildingModel
    {
        public int Id { get; set; }
        public string BuildingId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public Nullable<double> GFA { get; set; }
        public Nullable<double> EUI { get; set; }
        public string ContactPerson { get; set; }
        public Nullable<int> GreenMarkRating { get; set; }
        public string GreenMarkExpiry { get; set; }
        public string Award { get; set; }
        public Nullable<int> Type { get; set; }
        public Nullable<double> AirconditionedArea { get; set; }
        public string Established { get; set; }
        public Nullable<System.DateTime> WorkingPeriodStart { get; set; }
        public Nullable<System.DateTime> WorkingPeriodEnd { get; set; }
        public Nullable<int> Status { get; set; }
        public string ImageLocation { get; set; }
        public Nullable<double> Longitude { get; set; }
        public Nullable<double> Lattitude { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public string IPAddress { get; set; }
        public string WorkingPeriod { get; set; }
        public Nullable<double> Tariff { get; set; }

        public string Heatbalance { get; set; }
        public string Efficiency { get; set; }
        public string LastSyncedDay { get; set; }
        public Nullable<int> NotificationProcess { get; set; }
        public string ChillerPlantBitmap { get; set; }
        public Nullable<double> ChwFlowDesigned { get; set; }
        public Nullable<double> CwFlowDesigned { get; set; }
        public Nullable<double> SystemEfficiencyDesigned { get; set; }
        public Nullable<int> BaselineType { get; set; }
        public string OperatingFromWeekDay { get; set; }
        public string OperatingToWeekDay { get; set; }
    }
}