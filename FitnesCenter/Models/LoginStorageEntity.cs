using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class LoginStorageEntity
    {
        public string AccessToken { get; set; }
        public Korisnik Korisnik { get; set; }
    }
}