using System.Collections.Generic;

namespace Fmcc.Extension
{
    public class Block
    {
        public string Name { get; set; }
        public string Image { get; set; }
        public double? Water { get; set; }
        public double? Power { get; set; }
    }
    public class Dashboard
    {
        public double WaterAvg { get; set; }
        public double PowerAvg { get; set; }
        public double AlarmCount { get; set; }

        public double AlertCount { get; set; }
        public List<Block> Blocks { get; set; }
    }
}