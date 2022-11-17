namespace Fmcc.Extension
{
    public static class util
    {
        public static bool isNull(object obj)
        {
            if (obj == null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool isZero(object obj)
        {
            if (obj.Equals(0))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}