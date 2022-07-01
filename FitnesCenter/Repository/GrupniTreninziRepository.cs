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

                    string posetioci = "null";
                    if (el.Posetioci.Count != 0)
                    {
                        posetioci = "";
                        foreach (var _el in el.Posetioci)
                        {
                            posetioci += $"{_el.Username};";
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
                    bool isDeletedFile = line.Split('=')[7] == "true" ? true : false;

                    string datum = datumVreme.Split(' ')[0];
                    string vreme = datumVreme.Split(' ')[1];

                    string dan = datum.Split('/')[0];
                    string mesec = datum.Split('/')[1];
                    string godina = datum.Split('/')[2];

                    string sat = vreme.Split(':')[0];
                    string minut = vreme.Split(':')[1];

                    var datumVremeAttr = $"{dan}/{mesec}/{godina} {sat}:{minut}";
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

        public GrupniTrening GetGrupniTreningByNaziv(Guid id)
        {
            GrupniTrening retVal = new GrupniTrening();
            foreach(var el in BazePodataka.treninzi)
            {
                if (el.Id == id && !el.isDeleted) { retVal = el; break; }
            }

            return retVal;
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

        public List<GrupniTrening> GetOdrzaneGrupneTreningeForPosetilac(string username)
        {
            List<GrupniTrening> retVal = new List<GrupniTrening>();

            foreach (var el in BazePodataka.treninzi)
            {
                foreach (var _el in el.Posetioci)
                {
                    if(string.Equals(_el.Username, username) && DateTime.Now > el.DatumVreme && !el.isDeleted)
                    {
                        retVal.Add(el);
                        break;
                    } 
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

        public bool UpdateGrupniTrening(GrupniTrening trening)
        {
            for (int i = 0; i < BazePodataka.treninzi.Count; i++)
            {
                if (string.Equals(BazePodataka.treninzi[i].Naziv, trening.Naziv))
                {
                    trening.FitnesCentar = BazePodataka.treninzi[i].FitnesCentar;
                    trening.Posetioci = BazePodataka.treninzi[i].Posetioci;
                    BazePodataka.treninzi[i] = trening;

                    BazePodataka.grupniTreninziRepository.SaveToFile();
                    return true;
                }
            }

            return false; 
        }

        public bool AddGrupniTrening(GrupniTrening trening)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (!string.Equals(el.Naziv, trening.Naziv))
                {
                    BazePodataka.treninzi.Add(trening);
                    return true;
                }
            }

            return false;
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
    }
}