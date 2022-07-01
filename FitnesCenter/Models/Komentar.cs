using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class Komentar
    {
        public Guid Id { get; set; }
        public string Posetilac { get; set; }     // Posetilac koji je ostavio komentar. TJ. Username
        public Guid FitnesCentar { get; set; }  // Fitnes centar na koji se odnosi TJ. ID
        public string Sadrzaj { get; set; } 
        public int Ocena { get; set; }  // Skala: 1 - 5
        // Proveriti prvo NotTouched pa onda Odobren [Kada se napravi komentar NotTouched je true => Odobren false]
        // Ako:
        // NotTouched: false -> Odobren: true => KOMENTAR VIDE SVI.
        // NotTouched: false -> Odobren: false => KOMENTAR VIDI SAMO VLASNIK.
        // NotTouched: true -> Odobren: false => KOMENTAR VIDI SAMO VLASNIK I TREBA GA ODOBRITI/ODBITI.
        //
        public bool NotTouched { get; set; }
        public bool Odobren { get; set; }
    }
}