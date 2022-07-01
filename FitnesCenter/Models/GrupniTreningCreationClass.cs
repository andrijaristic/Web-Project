using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class GrupniTreningCreationClass
    {
        public GrupniTrening Trening { get; set; }
        public Guid FitnesCentarId { get; set; }
        public string TrenerUsername { get; set; }
    }
}