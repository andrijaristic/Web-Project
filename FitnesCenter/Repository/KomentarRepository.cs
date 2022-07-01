using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using FitnesCenter.Models;

namespace FitnesCenter.Repository
{
    public class KomentarRepository
    {
        public void SaveToFile()
        {
            // Ocisti fajl.
            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\komentari.txt"));
            File.WriteAllText(path, String.Empty);

            using (StreamWriter sw = new StreamWriter(path))
            {
                string line = "";
                foreach (var el in BazePodataka.komentari)
                {
                    line += $"{el.Id}={el.Posetilac}={el.FitnesCentar}={el.Sadrzaj}={el.Ocena}=" +
                    $"{(el.NotTouched ? "true" : "false")}={(el.Odobren ? "true" : "false")}\n";
                }

                sw.WriteLine(line);
            }
        }
        
        public List<Komentar> GetAllKomentare()
        {
            List<Komentar> retVal = new List<Komentar>();

            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"App_Data\\komentari.txt"));
            using (StreamReader sr = new StreamReader(path))
            {
                string line = sr.ReadLine();
                while (!string.IsNullOrEmpty(line))
                {
                    Guid.TryParse(line.Split('=')[0], out Guid id);
                    string posetilac = line.Split('=')[1];
                    Guid.TryParse(line.Split('=')[2], out Guid fitnesCentarId);
                    string sadrzaj = line.Split('=')[3];
                    int ocena = int.Parse(line.Split('=')[4]);
                    bool notTouched = line.Split('=')[5] == "true" ? true : false;
                    bool odobren = line.Split('=')[6] == "true" ? true : false;

                    retVal.Add(new Komentar()
                    {
                        Id = id,
                        Posetilac = posetilac,
                        FitnesCentar = fitnesCentarId,
                        Sadrzaj = sadrzaj,
                        Ocena = ocena,
                        NotTouched = notTouched,
                        Odobren = odobren
                    });

                    line = sr.ReadLine();
                }
            }

            return retVal;
        }

        public Komentar GetKomentarById(Guid id)
        {
            Komentar retVal = new Komentar();
            foreach (var el in BazePodataka.komentari)
            {
                if (el.Id == id)
                {
                    retVal = el;
                    break;
                }
            }

            return retVal;
        }

        public List<Komentar> GetKomentareForCentar(Guid id)
        {
            List<Komentar> retVal = new List<Komentar>();

            foreach (var el in BazePodataka.komentari)
            {
                if (el.FitnesCentar == id)
                {
                    retVal.Add(el);
                }
            }

            return retVal;
        }

        public bool CheckIfKomentarExists(Guid id)
        {
            foreach (var el in BazePodataka.komentari)
            {
                if (el.Id == id) { return true; }
            }

            return false;
        }

        public bool AddKomentar(Komentar komentar)
        {
            if (CheckIfKomentarExists(komentar.Id)) { return true; }

            BazePodataka.komentari.Add(komentar);

            BazePodataka.komentarRepository.SaveToFile();
            return true;
        }

        public bool OdobriKomentar(Guid id)
        {
            foreach (var el in BazePodataka.komentari)
            {
                if (el.Id == id)
                {
                    el.NotTouched = false;
                    el.Odobren = true;

                    BazePodataka.komentarRepository.SaveToFile();
                    return true;
                }
            }

            return false;
        }

        public bool OdbijKomentar(Guid id)
        {
            foreach (var el in BazePodataka.komentari)
            {
                if (el.Id == id)
                {
                    el.NotTouched = false;
                    el.Odobren = false;

                    BazePodataka.komentarRepository.SaveToFile();
                    return true;
                }
            }

            return false;
        }
    }
}