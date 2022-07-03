using FitnesCenter.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace FitnesCenter.Repository
{
    public class GrupniTreninziRepository
    {
        public void SaveToFile()
        {
            // Ocisti fajl.
            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\grupniTreninzi.txt"));
            File.WriteAllText(path, String.Empty);

            using (StreamWriter sw = new StreamWriter(path))
            {
                string line = "";
                foreach (var el in BazePodataka.treninzi)
                {
                    // dd/MM/yyyy HH:mm
                    string dan = el.DatumVreme.Day.ToString();
                    string mesec = el.DatumVreme.Month.ToString();
                    string godina = el.DatumVreme.Year.ToString();
                    string sat = el.DatumVreme.Hour.ToString();
                    string minut = el.DatumVreme.Minute.ToString();

                    if (dan.Length == 1)
                    {
                        dan = $"0{dan}";
                    }

                    if (mesec.Length == 1)
                    {
                        mesec = $"0{mesec}";
                    }

                    if (sat.Length == 1)
                    {
                        sat = $"0{sat}";
                    }

                    if (minut.Length == 1)
                    {
                        minut = $"0{minut}";
                    }

                    string posetioci = "null";
                    if (el.Posetioci.Count != 0)
                    {
                        int i = 0;
                        posetioci = "";
                        foreach (var _el in el.Posetioci)
                        {
                            posetioci += $"{_el.Username}";
                            if (i+1 < el.Posetioci.Count)
                            {
                                posetioci += ";";
                                i++;
                            }
                        }
                    }

                    line += $"{el.Id}={el.Naziv}={el.TipTreninga.ToString()}={el.FitnesCentar.Id}={el.TrajanjeTreninga}={dan}/{mesec}/{godina} {sat}:{minut}=" +
                    $"{el.MaksBrojPosetilaca}={posetioci}={(el.isDeleted ? "true" : "false")}\n";
                }

                sw.WriteLine(line);
            }
        }

        public List<GrupniTrening> GetAllGrupneTreninge()
        {
            List<GrupniTrening> retVal = new List<GrupniTrening>();

            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\grupniTreninzi.txt"));
            using (StreamReader sr = new StreamReader(path))
            {
                string line = sr.ReadLine();
                while (!string.IsNullOrEmpty(line))
                {
                    Guid.TryParse(line.Split('=')[0], out Guid id);
                    string naziv = line.Split('=')[1];
                    string tipTreninga = line.Split('=')[2];
                    //string fitnesCentarNaziv = line.Split('-')[2];
                    Guid.TryParse(line.Split('=')[3], out Guid idCentar);
                    int trajanje = int.Parse(line.Split('=')[4]);
                    string datumVreme = line.Split('=')[5]; // dd/MM/yyy HH:mm
                    int brojPosetilaca = int.Parse(line.Split('=')[6]);
                    bool isDeletedFile = line.Split('=')[8] == "true" ? true : false;

                    //string posetiociSvi = line.Split('=')[7];
                    //List<string> posetiociStringList = new List<string>();
                    //List<Korisnik> posetioci = new List<Korisnik>();
                    //if (posetiociSvi != "null")
                    //{
                    //    posetiociStringList = posetiociSvi.Split(';').ToList<string>();
                    //    posetioci = BazePodataka.korisnikRepository.GetPosetioce(posetiociStringList);
                    //}

                    string datum = datumVreme.Split(' ')[0];
                    string vreme = datumVreme.Split(' ')[1];

                    string dan = datum.Split('/')[0];
                    string mesec = datum.Split('/')[1];
                    string godina = datum.Split('/')[2];

                    string sat = vreme.Split(':')[0];
                    string minut = vreme.Split(':')[1];

                    var datumVremeAttr = $"{mesec}/{dan}/{godina} {sat}:{minut}";
                    DateTime date = DateTime.Parse(datumVremeAttr, System.Globalization.CultureInfo.InvariantCulture);

                    FitnesCentar fc = BazePodataka.fitnesCentarRepository.GetFitnesCentarByNaziv(idCentar);
                    Enum.TryParse(tipTreninga, out Enums.TipTreninga enumTipTreninga);
                    //Enums.TipTreninga enumTipTreninga = tipTreninga == "yoga" ? Enums.TipTreninga.YOGA :
                    //                                    tipTreninga == "les mills one" ? Enums.TipTreninga.LES_MILLS_TONE : Enums.TipTreninga.BODY_PUMP;

                    retVal.Add(new GrupniTrening()
                    {
                        Id = id,
                        Naziv = naziv,
                        TipTreninga = enumTipTreninga,
                        FitnesCentar = fc,
                        TrajanjeTreninga = trajanje,
                        DatumVreme = date,
                        MaksBrojPosetilaca = brojPosetilaca,
                        Posetioci = new List<Korisnik>(),
                        isDeleted = isDeletedFile
                    });

                    line = sr.ReadLine();
                }
            }

            return retVal;
        }

        public void ReadPosetioceFromTreningsFile()
        {
            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\grupniTreninzi.txt"));
            using (StreamReader sr = new StreamReader(path))
            {
                string line = sr.ReadLine();
                while (!string.IsNullOrEmpty(line))
                {
                    Guid.TryParse(line.Split('=')[0], out Guid id);
                    string posetiociSvi = line.Split('=')[7];

                    List<string> posetiociStringList = new List<string>();
                    List<Korisnik> posetici = new List<Korisnik>();
                    if (posetiociSvi != "null")
                    {
                        posetiociStringList = posetiociSvi.Split(';').ToList<string>();
                        posetici = BazePodataka.korisnikRepository.GetPosetioce(posetiociStringList);
                        AddPosetioceToTrening(id, posetici);
                    }

                    line = sr.ReadLine();
                }
            }
        }

        public void AddPosetioceToTrening(Guid id, List<Korisnik> posetici)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (el.Id == id)
                {
                    el.Posetioci = posetici;
                    return;
                }
            }
        }

        public GrupniTrening GetGrupniTreningByNaziv(Guid id)
        {
            foreach(var el in BazePodataka.treninzi)
            {
                if (el.Id == id && !el.isDeleted)
                {
                    return el;
                }
            }

            return null;
        }

        public bool AddPosetilacToGrupniTrening(Guid id, Korisnik korisnik)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (el.Id == id && (el.Posetioci == null || el.Posetioci.Count < el.MaksBrojPosetilaca) && !el.isDeleted)
                {
                    foreach (var _el in el.Posetioci)
                    {
                        if (string.Equals(_el.Username, korisnik.Username))
                        {
                            return false;
                        }
                    }

                    el.Posetioci.Add(korisnik);
                    BazePodataka.korisnikRepository.AddTreningToPosetilacList(id, korisnik.Username);

                    BazePodataka.grupniTreninziRepository.SaveToFile();
                    return true;
                }
            }

            return false;
        }

        public List<GrupniTrening> GetOdrzaneGrupneTreningeForPosetilac(Korisnik posetilac)
        {
            List<GrupniTrening> retVal = new List<GrupniTrening>();

            if (posetilac.GrupniTreninziPosetioc.Count == 0)
            {
                return retVal;
            }

            foreach (var el in posetilac.GrupniTreninziPosetioc)
            {
                GrupniTrening trening = BazePodataka.grupniTreninziRepository.GetGrupniTreningByNaziv(el);
                if (trening == null) { continue; }

                if (trening.DatumVreme.ToUniversalTime() < DateTime.Now.ToUniversalTime())
                {
                    retVal.Add(trening);
                }
            }

            return retVal;
        }

        public List<GrupniTrening> GetOdrzaneGrupneTreningeForTrener(List<GrupniTrening> treninzi)
        {   
            List<GrupniTrening> retVal = new List<GrupniTrening>();

            foreach (var el in treninzi)
            {
                if (el.DatumVreme < DateTime.Now && !el.isDeleted)
                {
                    retVal.Add(el);
                }
            }

            return retVal;
        }

        public bool DeleteTrening(Guid id)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (el.Id == id){
                    if (!el.isDeleted && el.Posetioci.Count == 0)
                    {
                        el.isDeleted = true;

                        BazePodataka.grupniTreninziRepository.SaveToFile();
                        return true;
                    }
                    else
                    {
                        break;
                    }
                }
            }

            return false;
        }

        public bool UpdateGrupniTrening(GrupniTrening trening, string username)
        {
            for (int i = 0; i < BazePodataka.treninzi.Count; i++)
            {
                if (BazePodataka.treninzi[i].Id == trening.Id)
                {
                    trening.FitnesCentar = BazePodataka.treninzi[i].FitnesCentar;
                    trening.Posetioci = BazePodataka.treninzi[i].Posetioci;

                    if (!ValidateUpdateTrening(trening))
                    {
                        return false;
                    }

                    BazePodataka.treninzi[i] = trening;
                    if (!BazePodataka.korisnikRepository.UpdateGrupneTreninge(trening, username))
                    {
                        return false;
                    }

                    BazePodataka.grupniTreninziRepository.SaveToFile();
                    return true;
                }
            }

            return false; 
        }

        public GrupniTrening AddGrupniTrening(GrupniTreningCreationClass trening)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (el.Id != trening.Trening.Id)
                {
                    Korisnik trener = BazePodataka.korisnikRepository.GetKorisnikByUsername(trening.TrenerUsername);
                    foreach (var _el in trener.GrupniTreninziTrener)
                    {
                        if (_el.DatumVreme == trening.Trening.DatumVreme)
                        {
                            return el;
                        }
                    }
                }
            }

            trening.Trening.Posetioci = new List<Korisnik>();

            if (!BazePodataka.grupniTreninziRepository.ValidateUpdateTrening(trening.Trening))
            {
                return null;
            }

            BazePodataka.treninzi.Add(trening.Trening);
            BazePodataka.korisnikRepository.AddTreningToTrener(trening);

            BazePodataka.grupniTreninziRepository.SaveToFile();
            return trening.Trening;
        }

        public List<GrupniTrening> GetGrupneTreningeForCentar(Guid id)
        {
            List<GrupniTrening> retVal = new List<GrupniTrening>();

            foreach (var el in BazePodataka.treninzi)
            {
                if (el.FitnesCentar.Id == id && el.DatumVreme.ToUniversalTime() < DateTime.Now.ToUniversalTime())
                {
                    retVal.Add(el);
                }
            }

            return retVal;
        }

        public void UpdateFitnesCentarForGrupneTreninge(FitnesCentar centar)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (el.FitnesCentar.Id == centar.Id)
                {
                    el.FitnesCentar = centar;
                }
            }
        }

        public bool CheckIfExists(Guid id)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (el.Id == id)
                {
                    return true;
                }
            }

            return false;
        }

        public bool ValidatePosetiTrening(GrupniTreningPosetilacEntity gtpe)
        {
            if (gtpe.Id == null)
            {
                return false;
            }

            if (string.IsNullOrEmpty(gtpe.Korisnik.Username))
            {
                return false;
            }

            if (string.IsNullOrEmpty(gtpe.Korisnik.Password))
            {
                return false;
            }

            if (string.IsNullOrEmpty(gtpe.Korisnik.Ime))
            {
                return false;
            }

            if (string.IsNullOrEmpty(gtpe.Korisnik.Prezime))
            {
                return false;
            }

            if (string.IsNullOrEmpty(gtpe.Korisnik.Email))
            {
                return false;
            }

            if (gtpe.Korisnik.Pol != Enums.Pol.MUSKI && gtpe.Korisnik.Pol != Enums.Pol.ZENSKI)
            {
                return false;
            }

            if (gtpe.Korisnik.Uloga != Enums.Uloge.POSETILAC && gtpe.Korisnik.Uloga != Enums.Uloge.TRENER && gtpe.Korisnik.Uloga != Enums.Uloge.VLASNIK)
            {
                return false;
            }

            if (gtpe.Korisnik.GrupniTreninziPosetioc == null)
            {
                return false;
            }

            if (gtpe.Korisnik.GrupniTreninziTrener == null)
            {
                return false;
            }

            if (gtpe.Korisnik.FitnesCentarTrener == null)
            {
                return false;
            }

            if (gtpe.Korisnik.FitnesCentarVlasnik == null)
            {
                return false;
            }

            return true;
        }

        public bool ValidateUpdateTrening(GrupniTrening trening)
        {
            if (trening.Id == Guid.Empty)
            {
                return false;
            }

            if (string.IsNullOrEmpty(trening.Naziv))
            {
                return false;
            }

            if (trening.TipTreninga != Enums.TipTreninga.YOGA && trening.TipTreninga != Enums.TipTreninga.LES_MILLS_TONE && trening.TipTreninga != Enums.TipTreninga.BODY_PUMP)
            {
                return false;
            }

            if (trening.FitnesCentar == null)
            {
                return false;
            }

            if (trening.TrajanjeTreninga < 0 || trening.TrajanjeTreninga == 0)
            {
                return false;
            }

            if (trening.DatumVreme == null)
            {
                return false;
            }

            if (trening.MaksBrojPosetilaca < 0 || trening.MaksBrojPosetilaca == 0)
            {
                return false;
            }

            if (trening.Posetioci == null)
            {
                return false;
            }

            return true;
        }
    }
}