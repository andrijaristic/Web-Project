using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class FitnesCentar
    {
        public Guid Id { get; set; }
        public string Naziv { get; set; }
        public string Adresa { get; set; }  // Format: Ulica i broj, mesto/grad, postanski broj
        public int GodinaOtvaranja { get; set; }
        public Korisnik Vlasnik { get; set; }
        public double CenaMesecneClanarine { get; set; }
        public double CenaGodisnjeClanarine { get; set; }
        public double CenaJednogTreninga { get; set; }
        public double CenaJednogGrupnogTreninga { get; set; }
        public double CenaJednogTreningaSaTrenerom { get; set; }
        public bool isDeleted { get; set; }
    }
}