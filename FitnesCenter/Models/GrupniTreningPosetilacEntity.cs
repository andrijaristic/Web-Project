using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class GrupniTreningPosetilacEntity
    {
        public string NazivGrupniTrening { get; set; }
        public Korisnik Korisnik { get; set; }
    }
}