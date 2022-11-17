using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fmcc.Extension
{
    public class ObjectModel
    {
        public int Id { get; set; }
        public string ObjectId { get; set; }
        public string Name { get; set; }
        public string Identifier { get; set; }
        public Nullable<bool> IsRaw { get; set; }
        public Nullable<bool> IsCompute { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public string IPAddress { get; set; }
    }
}