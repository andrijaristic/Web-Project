using FitnesCenter.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace FitnesCenter
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Putanja ~/FitnesCenter/FitnerCenter/testFile.txt
            string path = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "testFile.txt"));
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
                Models.Repo.centri.Add(new FitnesCentar() { Naziv = naziv,
                                                            Adresa = adresa,
                                                            GodinaOtvaranja = godina,
                                                            CenaMesecneClanarine = mesecna,
                                                            CenaGodisnjeClanarine = godisnja,
                                                            CenaJednogTreniniga = jedan,
                                                            CenaJednogGrupnoTreniniga = jedanGrupni,
                                                            CenaJednogTreninigaSaTrenerom = jedanGrupniTrener });
                line = sr.ReadLine();
            }
        }
    }
}
