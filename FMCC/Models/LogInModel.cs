using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Fmcc.Models
{
    public class LogInModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [HiddenInput]
        public string ReturnUrl { get; set; }

        [Display(Name = "Remember Me")]
        public bool RememberMe { get; set; }

    }
}