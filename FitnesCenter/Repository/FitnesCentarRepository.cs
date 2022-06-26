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
        // Preuzimanje svega iz .txt fajla.
        public List<FitnesCentar> GetAllFitnesCentre()
        {
            List<FitnesCentar> retVal = new List<FitnesCentar>();
            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\fitnesCentri.txt"));
            StreamReader sr = new StreamReader(path);
            string line = sr.ReadLine();
            while (line != null)
            {
                string naziv = line.Split('-')[0];
                string adresa = line.Split('-')[1];
                int godina = int.Parse(line.Split('-')[2]);
                double mesecna = double.Parse(line.Split('-')[3]);
                double godisnja = double.Parse(line.Split('-')[4]);
                double jedan = double.Parse(line.Split('-')[5]);
                double jedanGrupni = double.Parse(line.Split('-')[6]);
                double jedanGrupniTrener = double.Parse(line.Split('-')[7]);
                retVal.Add(new FitnesCentar()
                {
                    Naziv = naziv,
                    Adresa = adresa,
                    GodinaOtvaranja = godina,
                    CenaMesecneClanarine = mesecna,
                    CenaGodisnjeClanarine = godisnja,
                    CenaJednogTreniniga = jedan,
                    CenaJednogGrupnoTreniniga = jedanGrupni,
                    CenaJednogTreninigaSaTrenerom = jedanGrupniTrener
                });
                line = sr.ReadLine();
            }

            return retVal;
        }

        public FitnesCentar GetFitnesCentarByNaziv(string naziv)
        {
            foreach (var el in BazePodataka.centri)
            {
                if (string.Equals(el.Naziv, naziv))
                {
                    return el;
                }
            }

            return null;
        }
    }
}