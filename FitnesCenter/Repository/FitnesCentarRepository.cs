using FitnesCenter.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace FitnesCenter.Repository
{
    // Manipulacija FitnesCentar liste/txt fajla.
    public class FitnesCentarRepository
    {
        public void SaveToFile()
        {
            // Ocisti fajl.
            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\fitnesCentri.txt"));
            File.WriteAllText(path, String.Empty);

            using (StreamWriter sw = new StreamWriter(path))
            {
                string line = "";
                foreach (var el in BazePodataka.centri)
                {
                    string vlasnik = "null";
                    if (el.Vlasnik != null)
                    {
                        vlasnik = el.Vlasnik.Username;
                    }

                    line += $"{el.Id}={el.Naziv}={el.Adresa}={el.GodinaOtvaranja}={vlasnik}=" +
                    $"{el.CenaMesecneClanarine}={el.CenaGodisnjeClanarine}={el.CenaJednogTreninga}={el.CenaJednogGrupnogTreninga}={el.CenaJednogTreningaSaTrenerom}=" +
                    $"{(el.isDeleted ? "true" : "false")}\n";
                }

                sw.WriteLine(line);
            }
        }

        public void AddVlasnikeToCentre()
        {
            List<Korisnik> vlasnici = BazePodataka.korisnikRepository.GetVlasnike();
            foreach (var el in BazePodataka.centri)
            { 
                foreach (var _el in vlasnici)
                {
                    if (el.Vlasnik != null && string.Equals(el.Vlasnik.Username, _el.Username))
                    {
                        el.Vlasnik = _el;
                    }
                }
            }

            BazePodataka.fitnesCentarRepository.SaveToFile();
        }

        public List<FitnesCentar> GetAllFitnesCentre()
        {
            List<FitnesCentar> retVal = new List<FitnesCentar>();
            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\fitnesCentri.txt"));
            using (StreamReader sr = new StreamReader(path))
            {
                string line = sr.ReadLine();
                while (!string.IsNullOrEmpty(line))
                {
                    Guid.TryParse(line.Split('=')[0], out Guid id);
                    string naziv = line.Split('=')[1];
                    string adresa = line.Split('=')[2];
                    int godina = int.Parse(line.Split('=')[3]);
                    string vlasnik = line.Split('=')[4];
                    double mesecna = double.Parse(line.Split('=')[5]);
                    double godisnja = double.Parse(line.Split('=')[6]);
                    double jedan = double.Parse(line.Split('=')[7]);
                    double jedanGrupni = double.Parse(line.Split('=')[8]);
                    double jedanGrupniTrener = double.Parse(line.Split('=')[9]);
                    bool isDeletedFile = line.Split('=')[10] == "true" ? true : false;

                    if (string.Equals(vlasnik, null))
                    {
                        retVal.Add(new FitnesCentar()
                        {
                            Id = id,
                            Naziv = naziv,
                            Adresa = adresa,
                            Vlasnik = null,
                            GodinaOtvaranja = godina,
                            CenaMesecneClanarine = mesecna,
                            CenaGodisnjeClanarine = godisnja,
                            CenaJednogTreninga = jedan,
                            CenaJednogGrupnogTreninga = jedanGrupni,
                            CenaJednogTreningaSaTrenerom = jedanGrupniTrener,
                            isDeleted = isDeletedFile
                        });
                    } else
                    {
                        retVal.Add(new FitnesCentar()
                        {
                            Id = id,
                            Naziv = naziv,
                            Adresa = adresa,
                            Vlasnik = new Korisnik() { Username = vlasnik },
                            GodinaOtvaranja = godina,
                            CenaMesecneClanarine = mesecna,
                            CenaGodisnjeClanarine = godisnja,
                            CenaJednogTreninga = jedan,
                            CenaJednogGrupnogTreninga = jedanGrupni,
                            CenaJednogTreningaSaTrenerom = jedanGrupniTrener,
                            isDeleted = isDeletedFile
                        });
                    }

                    line = sr.ReadLine();
                }
            }

            return retVal;
        }

        public FitnesCentar GetFitnesCentarByNaziv(Guid id)
        {
            foreach (var el in BazePodataka.centri)
            {
                if (el.Id == id)
                {
                    return el;
                }
            }

            return null;
        }

        public Korisnik CreateFitnesCentar(FitnesCentar centar)
        {
            if (!CheckIfCentarExists(centar.Id))
            {
                BazePodataka.centri.Add(centar);
                Korisnik vlasnik = BazePodataka.korisnikRepository.AddFitnesCentarToVlasnik(centar);

                if (vlasnik != null)
                {
                    BazePodataka.fitnesCentarRepository.SaveToFile();
                    return vlasnik; 
                }

                return null;
            }

            return null;
        }

        public bool CheckIfCentarExists(Guid id)
        {
            foreach (var el in BazePodataka.centri)
            {
                if (el.Id == id)
                {
                    return true;
                }
            }

            return false;
        }

        public bool UpdateFitnesCentar(FitnesCentar centar)
        {
            for (int i = 0; i < BazePodataka.centri.Count; i++)
            {
                if (BazePodataka.centri[i].Id == centar.Id)
                {
                    if (!BazePodataka.fitnesCentarRepository.ValidateCreate(centar))
                    {
                        return false;
                    }

                    BazePodataka.centri[i] = centar;
                    BazePodataka.grupniTreninziRepository.UpdateFitnesCentarForGrupneTreninge(centar);

                    //BazePodataka.fitnesCentarRepository.SaveToFile();
                    return true;
                }
            }

            return false;
        }

        public bool DeleteFitnesCentar(Guid id)
        {
            foreach (var el in BazePodataka.centri)
            {
                // Nasli smo koga brisemo.
                if (el.Id == id)
                {
                    // Proveri da li ima treninga koji ce se odrzati u buducnosti (ZA SAD PROSLOSTI KAKO NE BI PUKLO)
                    foreach (var _el in BazePodataka.treninzi)
                    {
                        if (_el.FitnesCentar.Id == el.Id && _el.DatumVreme.ToUniversalTime() > DateTime.Now.ToUniversalTime() && !_el.isDeleted)
                        {
                            return false;
                        }
                    }

                    // Blokiraj sve njegove trenere.
                    el.isDeleted = true;
                    foreach (var _el2 in BazePodataka.korisnici)
                    {
                        if (_el2.Uloga == Enums.Uloge.TRENER && _el2.FitnesCentarTrener.Id == el.Id)
                        {
                            _el2.isBlocked = true;
                        }
                    }

                    BazePodataka.fitnesCentarRepository.SaveToFile();
                    BazePodataka.korisnikRepository.SaveToFile();
                    return true;
                }
            }

            return false;
        }

        public List<FitnesCentar> GetValidFitnesCentre()
        {
            List<FitnesCentar> retVal = new List<FitnesCentar>();

            foreach (var el in BazePodataka.centri)
            {
                if (!el.isDeleted)
                {
                    retVal.Add(el);
                }
            }

            return retVal;
        }

        public bool ValidateCreate(FitnesCentar centar)
        {
            if (centar.Id == Guid.Empty)
            {
                return false;
            }

            if (string.IsNullOrEmpty(centar.Naziv))
            {
                return false;
            }

            if (string.IsNullOrEmpty(centar.Adresa))
            {
                return false;
            }

            if (centar.GodinaOtvaranja < 0 || centar.GodinaOtvaranja < 1000 || centar.GodinaOtvaranja > DateTime.Now.Year)
            {
                return false;
            }

            if (centar.CenaMesecneClanarine < 0)
            {
                return false;
            }

            if (centar.CenaGodisnjeClanarine < 0)
            {
                return false;
            }

            if (centar.CenaJednogTreninga < 0)
            {
                return false;
            }

            if (centar.CenaJednogGrupnogTreninga < 0)
            {
                return false;
            }

            if (centar.CenaJednogTreningaSaTrenerom < 0)
            {
                return false;
            }

            return true;
        }
    }
}