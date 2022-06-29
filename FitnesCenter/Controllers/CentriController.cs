using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using FitnesCenter.Models;
using FitnesCenter.Repository;

namespace FitnesCenter.Controllers
{
    public class CentriController : ApiController
    {
        [HttpGet, Route("")]
        public RedirectResult Index()
        {
            var requestUri = Request.RequestUri;
            return Redirect(requestUri.AbsoluteUri + "Index.html");
        }

        public List<FitnesCentar> Get()
        {
            return Repository.BazePodataka.centri;
        }

        [HttpGet]
        [Route("api/centri/GetCentar")]
        public IHttpActionResult Get(string naziv)
        {
            FitnesCentar retVal = null;
            foreach (var el in BazePodataka.centri)
            {
                if (el.Naziv.Equals(naziv)) { retVal = el; }
            }
            return Ok(retVal);
        }

        [HttpGet]
        [Route("api/centri/GetTreninge")]
        public IHttpActionResult GetTreninge(string naziv)
        {
            List<GrupniTrening> retVal = new List<GrupniTrening>();
            foreach (var el in BazePodataka.treninzi)
            {
                if (string.Equals(el.FitnesCentar.Naziv, naziv) && el.DatumVreme < DateTime.Now && !el.isDeleted)
                {
                    retVal.Add(el);
                }
            }

            return Ok(retVal);
        }
    }
}
