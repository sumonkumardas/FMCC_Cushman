namespace Fmcc.Models
{
    // Response Model 
    public class ResponseModel
    {
        public bool flag { get; set; }
        public string text { get; set; }
        public object model { get; set; }
    }
    // Generic Response Model 
    public class ResponseModel<T>
    {
        public T model { get; set; }
        public bool flag { get; set; }
        public string text { get; set; }
    }

    public class Output
    {
        public bool okay { get; set; }
        public string message { get; set; }
        public object model { get; set; }
    }
}