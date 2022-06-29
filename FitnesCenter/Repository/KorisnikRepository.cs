using FitnesCenter.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace FitnesCenter.Repository
{
    public class KorisnikRepository
    {
        public List<Korisnik> GetAllKorisnike()
        {
            List<Korisnik> retVal = new List<Korisnik>();

            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\korisnici.txt"));
            StreamReader sr = new StreamReader(path);
            string line = sr.ReadLine();
            while (line != null)
            {
                string username = line.Split('-')[0];
                string password = line.Split('-')[1];
                string ime = line.Split('-')[2];
                string prezime = line.Split('-')[3];
                string pol = line.Split('-')[4];
                string email = line.Split('-')[5];
                string datum = line.Split('-')[6];
                string uloga = line.Split('-')[7];

                string dan = datum.Split('.')[0];
                string mesec = datum.Split('.')[1];
                string godina = datum.Split('.')[2];
                var datumAttr = $"{dan}-{mesec}-{godina}";
                string pattern = "dd-MM-yyyy";
                DateTime date;
                DateTime.TryParseExact(datumAttr, pattern, null, System.Globalization.DateTimeStyles.None, out date);

                Enums.Uloge enumUloga = uloga == "vlasnik" ?  Enums.Uloge.VLASNIK : 
                                        uloga == "trener"  ?  Enums.Uloge.TRENER  : Enums.Uloge.POSETILAC;

                Enums.Pol enumPol = pol == "muski" ? Enums.Pol.MUSKI : Enums.Pol.ZENSKI;

                if (enumUloga == Enums.Uloge.TRENER)
                {
                    Korisnik korisnik = new Korisnik()
                    {
                        Username = username,
                        Password = password,
                        Ime = ime,
                        Prezime = prezime,
                        Pol = enumPol,
                        Email = email,
                        DatumRodjenja = date,
                        Uloga = enumUloga,
                        GrupniTreninziTrener = new List<GrupniTrening>()
                    };

                    korisnik.GrupniTreninziTrener.Add(BazePodataka.treninzi[1]);
                    retVal.Add(korisnik);                    
                } else
                {
                    Korisnik korisnik = new Korisnik()
                    {
                        Username = username,
                        Password = password,
                        Ime = ime,
                        Prezime = prezime,
                        Pol = enumPol,
                        Email = email,
                        DatumRodjenja = date,
                        Uloga = enumUloga,
                    };
                    retVal.Add(korisnik);
                }

                line = sr.ReadLine();
            }

            return retVal;
        }

        public bool CheckIfKorisnikExists(string username)
        {
            foreach (var el in BazePodataka.korisnici)
            {
                if (el.Username == username) { return true; }
            }

            return false;
        }

        public Korisnik GetKorisnikByUsername(string username)
        {
            Korisnik retVal = new Korisnik();

            foreach (var el in BazePodataka.korisnici)
            {
                if (el.Username == username) { retVal = el; break; }
            }

            return retVal;
        }

        public bool UpdateKorisnik(Korisnik korisnik)
        {
            string oldUsername = korisnik.Username.Split('-')[0];
            string newUsername = korisnik.Username.Split('-')[1];
            korisnik.Username = oldUsername;

            for (int i = 0; i < BazePodataka.korisnici.Count; i++)
            {
                if (string.Equals(BazePodataka.korisnici[i].Username, korisnik.Username))
                {
                    korisnik.Username = newUsername;
                    BazePodataka.korisnici[i] = korisnik;
                    return true;
                }
            }
            return false;
        }
    }
}