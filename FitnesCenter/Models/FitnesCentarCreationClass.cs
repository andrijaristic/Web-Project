using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class FitnesCentarCreationClass
    {
        public string Naziv { get; set; }
        public string Adresa { get; set; }  // Format: Ulica i broj, mesto/grad, postanski broj
        public int GodinaOtvaranja { get; set; }
        public string Vlasnik { get; set; }
        public double CenaMesecneClanarine { get; set; }
        public double CenaGodisnjeClanarine { get; set; }
        public double CenaJednogTreniniga { get; set; }
        public double CenaJednogGrupnogTreniniga { get; set; }
        public double CenaJednogTreninigaSaTrenerom { get; set; }
    }
}