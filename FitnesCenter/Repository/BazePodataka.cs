using FitnesCenter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Repository
{
    class BazePodataka
    {
        // Baze.
        public static List<FitnesCentar> centri = new List<FitnesCentar>();
        public static List<GrupniTrening> treninzi = new List<GrupniTrening>();
        public static List<Korisnik> korisnici = new List<Korisnik>();

        // Pristupi fajlovima za editovanje baza i txt fajla.
        public static FitnesCentarRepository fitnesCentarRepository = new FitnesCentarRepository();
        public static GrupniTreninziRepository grupniTreninziRepository = new GrupniTreninziRepository();
        public static KorisnikRepository korisnikRepository = new KorisnikRepository();
    }
}