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
                    MaksBrojPosetilaca = brojPosetilaca 
                });

                line = sr.ReadLine();
            }

            return retVal;
        }
    }
}