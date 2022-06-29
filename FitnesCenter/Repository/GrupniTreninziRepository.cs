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
        public List<GrupniTrening> GetAllGrupneTreninge()
        {
            List<GrupniTrening> retVal = new List<GrupniTrening>();

            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\grupniTreninzi.txt"));
            StreamReader sr = new StreamReader(path);
            string line = sr.ReadLine();
            while (line != null)
            {
                string naziv = line.Split('-')[0];
                string tipTreninga = line.Split('-')[1];
                string fitnesCentarNaziv = line.Split('-')[2];
                int trajanje = int.Parse(line.Split('-')[3]);
                string datumVreme = line.Split('-')[4]; // dd/MM/yyy HH:mm
                int brojPosetilaca = int.Parse(line.Split('-')[5]);

                string datum = datumVreme.Split('?')[0];
                string vreme = datumVreme.Split('?')[1];

                string dan = datum.Split('.')[0];
                string mesec = datum.Split('.')[1];
                string godina = datum.Split('.')[2];

                string sat = vreme.Split('.')[0];
                string minut = vreme.Split('.')[1];

                var datumVremeAttr = $"{dan}/{mesec}/{godina} {sat}:{minut}";
                DateTime date = DateTime.Parse(datumVremeAttr, System.Globalization.CultureInfo.InvariantCulture);

                FitnesCentar fc = BazePodataka.fitnesCentarRepository.GetFitnesCentarByNaziv(fitnesCentarNaziv);
                Enums.TipTreninga enumTipTreninga = tipTreninga == "yoga" ? Enums.TipTreninga.YOGA : 
                                                    tipTreninga == "les mills one" ? Enums.TipTreninga.LES_MILLS_TONE : Enums.TipTreninga.BODY_PUMP;

                retVal.Add(new GrupniTrening()
                {
                    Naziv = naziv,
                    TipTreninga = enumTipTreninga,
                    FitnesCentar = fc,
                    TrajanjeTreninga = trajanje,
                    DatumVreme = date,
                    MaksBrojPosetilaca = brojPosetilaca,
                    Posetioci = new List<Korisnik>(),
                    isDeleted = false
                });

                line = sr.ReadLine();
            }

            return retVal;
        }

        public GrupniTrening GetGrupniTreningByNaziv(string naziv)
        {
            GrupniTrening retVal = new GrupniTrening();
            foreach(var el in BazePodataka.treninzi)
            {
                if (string.Equals(el.Naziv, naziv) && !el.isDeleted) { retVal = el; break; }
            }

            return retVal;
        }

        public bool AddPosetilacToGrupniTrening(string naziv, Korisnik korisnik)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (string.Equals(el.Naziv, naziv) && (el.Posetioci == null || el.Posetioci.Count < el.MaksBrojPosetilaca) && !el.Posetioci.Contains(korisnik) && !el.isDeleted)
                {
                    el.Posetioci.Add(korisnik);
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

        public bool DeleteTrening(string naziv)
        {
            foreach (var el in BazePodataka.treninzi)
            {
                if (string.Equals(el.Naziv, naziv) ){
                    if (!el.isDeleted && el.Posetioci.Count == 0)
                    {
                        el.isDeleted = true;
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
    }
}