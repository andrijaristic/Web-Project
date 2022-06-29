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

        [HttpGet]
        [Route("api/centri/GetStarter")]
        public IHttpActionResult GetStarter()
        {
            if (BazePodataka.centri.Count == 0)
            {
                return NotFound();
            }

            return Ok(BazePodataka.centri);
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
                if (string.Equals(el.FitnesCentar.Naziv, naziv) && el.DatumVreme < DateTime.Now.ToUniversalTime() && !el.isDeleted)
                {
                    //Console.WriteLine($"{DateTime.Now.ToUniversalTime()}");
                    retVal.Add(el);
                }
            }

            return Ok(retVal);
        }

        [HttpPost]
        [Route("api/centri/CreateFitnesCentar")]
        public IHttpActionResult CreateFitnesCentar([FromBody]FitnesCentar centar)
        {
            Korisnik vlasnik = BazePodataka.fitnesCentarRepository.CreateFitnesCentar(centar);
            if (vlasnik != null)
            {
                return Ok(vlasnik);
            }
            return BadRequest();
        }

        [HttpPut]
        [Route("api/centri/IzmeniCentar")]
        public IHttpActionResult IzmeniCentar([FromBody]FitnesCentar centar)
        {
            if (BazePodataka.fitnesCentarRepository.UpdateFitnesCentar(centar))
            {
                return Ok(centar);
            }

            return BadRequest();
        }

        [HttpDelete]
        [Route("api/centri/ObrisiCentar")]
        public IHttpActionResult ObrisiCentar([FromUri]string naziv)
        {
            if (BazePodataka.fitnesCentarRepository.DeleteFitnesCentar(naziv))
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("api/centri/GetCentre")]
        public IHttpActionResult GetCentre()
        {
            List<FitnesCentar> retVal = new List<FitnesCentar>();
            foreach (var el in BazePodataka.centri)
            {
                if (!el.isDeleted)
                {
                    retVal.Add(el);
                }
            }

            if (retVal.Count == 0) { return BadRequest(); }

            return Ok(retVal);
        }
    }
}
