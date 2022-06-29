using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class Korisnik
    {
        public string Username { get; set; }    // Jedinstveno.
        public string Password { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public Enums.Pol Pol { get; set; }
        public string Email { get; set; }
        public DateTime DatumRodjenja { get; set; } // Format: dd/MM/yyyy
        public Enums.Uloge Uloga { get; set; }
        public List<Guid> GrupniTreninziPosetioc { get; set; }  // Promenjno na Guid za svaki trening. Nece se menjati.
        public List<GrupniTrening> GrupniTreninziTrener { get; set; }
        public FitnesCentar FitnesCentarTrener { get; set; }
        public List<Guid> FitnesCentarVlasnik { get; set; } // Promenjeno u listu zbog toga sto kaze da Vlasnik moze imati vise centara.
        public bool isBlocked { get; set; }
    }
}