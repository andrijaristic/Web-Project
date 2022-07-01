using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class RegisterTrener
    {
        public Korisnik Trener { get; set; }
        public Guid FitnesCentarId { get; set; }
    }
}