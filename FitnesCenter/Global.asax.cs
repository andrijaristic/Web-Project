using FitnesCenter.Repository;
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
            BazePodataka.centri = BazePodataka.fitnesCentarRepository.GetAllFitnesCentre();
            BazePodataka.treninzi = BazePodataka.grupniTreninziRepository.GetAllGrupneTreninge();
            BazePodataka.korisnici = BazePodataka.korisnikRepository.GetAllKorisnike();

            BazePodataka.fitnesCentarRepository.AddVlasnikeToCentre();
            //BazePodataka.fitnesCentarRepository.SaveToFile();
            //BazePodataka.grupniTreninziRepository.SaveToFile();
            //BazePodataka.korisnikRepository.SaveToFile();
        }
    }
}
