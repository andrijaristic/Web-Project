using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class Komentar
    {
        public Korisnik Posetilac { get; set; }     // Posetilac koji je ostavio komentar. 
        public FitnesCentar FitnesCentar { get; set; }  // Fitnes centar na koji se odnosi
        public string Sadrzaj { get; set; } 
        public int Ocena { get; set; }  // Skala: 1 - 5
    }
}