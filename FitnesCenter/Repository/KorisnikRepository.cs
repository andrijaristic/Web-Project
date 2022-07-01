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
        public void SaveToFile()
        {
            // Ocisti fajl.
            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\korisnici.txt"));
            File.WriteAllText(path, String.Empty);

            using (StreamWriter sw = new StreamWriter(path))
            {
                string line = "";
                foreach (var el in BazePodataka.korisnici)
                {
                    if (el.Uloga == Enums.Uloge.POSETILAC)
                    {
                        string dan = el.DatumRodjenja.Day.ToString();
                        string mesec = el.DatumRodjenja.Month.ToString();
                        string godina = el.DatumRodjenja.Year.ToString();
                        string grupniTreninziPosetilac = "null";

                        if (el.GrupniTreninziPosetioc != null && el.GrupniTreninziPosetioc.Count != 0)
                        {
                            int i = 0;
                            grupniTreninziPosetilac = "";
                            foreach (var _el in el.GrupniTreninziPosetioc)
                            {
                                grupniTreninziPosetilac += $"{_el}";
                                if (i+1 < el.GrupniTreninziPosetioc.Count)
                                {
                                    grupniTreninziPosetilac += ";";
                                    i++;
                                }
                            }
                        }

                        line += $"{el.Username}={el.Password}={el.Ime}={el.Prezime}={el.Pol.ToString()}={el.Email}={dan}/{mesec}/{godina}={el.Uloga.ToString()}" +
                        $"={grupniTreninziPosetilac}={"null"}={"null"}={"null"}={(el.isBlocked ? "true" : "false")}\n";
                    } else if (el.Uloga == Enums.Uloge.TRENER)
                    {
                        string dan = el.DatumRodjenja.Day.ToString();
                        string mesec = el.DatumRodjenja.Month.ToString();
                        string godina = el.DatumRodjenja.Year.ToString();
                        string grupniTreninziTrener = "null";

                        if (el.GrupniTreninziTrener != null && el.GrupniTreninziTrener.Count != 0)
                        {
                            int i = 0;
                            grupniTreninziTrener = "";
                            foreach (var _el in el.GrupniTreninziTrener)
                            {
                                grupniTreninziTrener += $"{_el.Id}";
                                if (i+1 < el.GrupniTreninziTrener.Count)
                                {
                                    grupniTreninziTrener += ";";
                                    i++;
                                }
                            }
                        }

                        line += $"{el.Username}={el.Password}={el.Ime}={el.Prezime}={el.Pol.ToString()}={el.Email}={dan}/{mesec}/{godina}={el.Uloga.ToString()}" +
                        $"={"null"}={grupniTreninziTrener}={el.FitnesCentarTrener.Id}={"null"}={(el.isBlocked ? "true" : "false")}\n";
                    } else if (el.Uloga == Enums.Uloge.VLASNIK)
                    {
                        string dan = el.DatumRodjenja.Day.ToString();
                        string mesec = el.DatumRodjenja.Month.ToString();
                        string godina = el.DatumRodjenja.Year.ToString();
                        string fitnesCentri = "null";

                        if (el.FitnesCentarVlasnik != null && el.FitnesCentarVlasnik.Count != 0)
                        {
                            int i = 0;
                            fitnesCentri = "";
                            foreach (var _el in el.FitnesCentarVlasnik)
                            {
                                fitnesCentri += $"{_el}";
                                if (i+1 < el.FitnesCentarVlasnik.Count)
                                {
                                    fitnesCentri += ";";
                                    i++;
                                }
                            }
                        }

                        line += $"{el.Username}={el.Password}={el.Ime}={el.Prezime}={el.Pol.ToString()}={el.Email}={dan}/{mesec}/{godina}={el.Uloga.ToString()}" +
                        $"={"null"}={"null"}={"null"}={fitnesCentri}={(el.isBlocked ? "true" : "false")}\n";
                    }
                }

                sw.WriteLine(line);
            }
        }

        public List<Korisnik> GetAllKorisnike()
        {
            List<Korisnik> retVal = new List<Korisnik>();

            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\korisnici.txt"));
            using (StreamReader sr = new StreamReader(path))
            {
                string line = sr.ReadLine();
                while (!string.IsNullOrEmpty(line))
                {
                    string username = line.Split('=')[0];
                    string password = line.Split('=')[1];
                    string ime = line.Split('=')[2];
                    string prezime = line.Split('=')[3];
                    Enum.TryParse(line.Split('=')[4], out Enums.Pol enumPol);
                    string email = line.Split('=')[5];
                    string datum = line.Split('=')[6];
                    Enum.TryParse(line.Split('=')[7], out Enums.Uloge enumUloga);

                    // Radi.
                    //
                    //Enum.TryParse(uloga, out Enums.Uloge enumUloga);
                    //Enum.TryParse(pol, out Enums.Pol enumPol);

                    // 8 - Treninzi posetioc || 9 - Treninzi trener || 10 - Centar trener || 11 - Centar vlasnik
                    List<Guid> grupniTreninziPosetioc = new List<Guid>();
                    List<GrupniTrening> grupniTreningTrener = new List<GrupniTrening>();
                    FitnesCentar fitnesCentarTrener = null;
                    List<Guid> fitnesCentarVlasnik = new List<Guid>();

                    if (enumUloga == Enums.Uloge.POSETILAC)
                    {
                        // Guid {Id} od svih grupnih treninga gde je posetilac.
                        // 8
                        if (!string.Equals(line.Split('=')[8], "null"))
                        {
                            string lista = line.Split('=')[8];
                            string[] guidLista = lista.Split(';');
                            foreach (var el in guidLista)
                            {
                                Guid.TryParse(el, out Guid id);
                                grupniTreninziPosetioc.Add(id);
                            }
                        }
                    }
                    else if (enumUloga == Enums.Uloge.TRENER)
                    { // 9 - 10
                        if (!string.Equals(line.Split('=')[9], "null"))
                        {
                            string lista = line.Split('=')[9];
                            List<string> guidLista = lista.Split(';').ToList<string>();

                            foreach (var el in guidLista)
                            {
                                Guid.TryParse(el, out Guid id);
                                GrupniTrening trening = BazePodataka.grupniTreninziRepository.GetGrupniTreningByNaziv(id);
                                grupniTreningTrener.Add(trening);
                            }

                        }

                        if (!string.Equals(line.Split('=')[10], "null"))
                        {
                            Guid.TryParse(line.Split('=')[10], out Guid id);
                            fitnesCentarTrener = BazePodataka.fitnesCentarRepository.GetFitnesCentarByNaziv(id);
                        }
                    }
                    else if (enumUloga == Enums.Uloge.VLASNIK)
                    { // 11
                        if (!string.Equals(line.Split('=')[11], "null"))
                        {
                            string lista = line.Split('=')[11];
                            List<string> guidLista = lista.Split(';').ToList<string>();

                            foreach (var el in guidLista)
                            {
                                Guid.TryParse(el, out Guid id);
                                fitnesCentarVlasnik.Add(id);
                            }
                        }
                    }

                    string dan = datum.Split('/')[0];
                    string mesec = datum.Split('/')[1];
                    string godina = datum.Split('/')[2];
                    var datumAttr = $"{dan}-{mesec}-{godina}";

                    string format = "dd-MM-yyyy";
                    DateTime.TryParseExact(datumAttr, format, null, System.Globalization.DateTimeStyles.None, out DateTime date);
                    //date = date.ToShortDateString();
                    

                    if (enumUloga == Enums.Uloge.VLASNIK)
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
                            GrupniTreninziPosetioc = grupniTreninziPosetioc,
                            GrupniTreninziTrener = grupniTreningTrener,
                            FitnesCentarTrener = fitnesCentarTrener,
                            FitnesCentarVlasnik = fitnesCentarVlasnik,
                            isBlocked = false
                        };

                        retVal.Add(korisnik);
                    }
                    else if (enumUloga == Enums.Uloge.TRENER)
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
                            GrupniTreninziPosetioc = grupniTreninziPosetioc,
                            GrupniTreninziTrener = grupniTreningTrener,
                            FitnesCentarTrener = fitnesCentarTrener,
                            FitnesCentarVlasnik = fitnesCentarVlasnik,
                            isBlocked = false
                        };

                        retVal.Add(korisnik);
                    }
                    else
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
                            GrupniTreninziPosetioc = grupniTreninziPosetioc,
                            GrupniTreninziTrener = grupniTreningTrener,
                            FitnesCentarTrener = fitnesCentarTrener,
                            FitnesCentarVlasnik = fitnesCentarVlasnik,
                            isBlocked = false
                        };
                        retVal.Add(korisnik);
                    }

                    line = sr.ReadLine();
                }
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
            foreach (var el in BazePodataka.korisnici)
            {
                if (el.Username == username) { return el; }
            }

            return null;
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

                    BazePodataka.korisnikRepository.SaveToFile();
                    return true;
                }
            }
            return false;
        }

        public Korisnik AddFitnesCentarToVlasnik(FitnesCentar centar)
        {
            for (int i = 0; i < BazePodataka.korisnici.Count; i++)
            {
                if (string.Equals(BazePodataka.korisnici[i].Username, centar.Vlasnik.Username))
                {
                    BazePodataka.korisnici[i].FitnesCentarVlasnik.Add(centar.Id);

                    BazePodataka.korisnikRepository.SaveToFile();
                    return BazePodataka.korisnici[i];
                }
            }

            return null;
        }

        public List<Korisnik> GetVlasnike()
        {
            List<Korisnik> retVal = new List<Korisnik>();

            foreach (var el in BazePodataka.korisnici)
            {
                if (el.Uloga == Enums.Uloge.VLASNIK)
                {
                    retVal.Add(el);
                }
            }

            return retVal;
        }

        public bool AddTreningToPosetilacList(Guid id, string username)
        {
            if (!CheckIfKorisnikExists(username)) { return false; }

            foreach (var el in BazePodataka.korisnici)
            {
                if (string.Equals(el.Username, username))
                {
                    if (!el.GrupniTreninziPosetioc.Contains(id))
                    {
                        el.GrupniTreninziPosetioc.Add(id);

                        BazePodataka.korisnikRepository.SaveToFile();
                        return true;
                    }
                }
            }

            return false;
        }

        public bool CheckIfTrenerHasTrening(Korisnik trener, Guid treningId)
        {
            foreach (var el in trener.GrupniTreninziTrener)
            {
                if (el.Id == treningId)
                {
                    return true;
                }

            }

            return false;
        }

        public bool AddTreningToTrener(GrupniTreningCreationClass trening)
        {
            foreach (var el in BazePodataka.korisnici)
            {
                if (string.Equals(trening.TrenerUsername, el.Username))
                {
                    if (CheckIfTrenerHasTrening(el, trening.Trening.Id))
                    {
                        return false;
                    }

                    el.GrupniTreninziTrener.Add(trening.Trening);

                    BazePodataka.korisnikRepository.SaveToFile();
                    return true;
                }
            }

            return false;
        }
    }
}