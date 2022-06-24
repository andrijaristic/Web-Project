using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using FitnesCenter.Models;

namespace FitnesCenter.Controllers
{
    public class CentriController : ApiController
    {
        [HttpGet, Route("")]
        public RedirectResult Index()
        {
            var requestUri = Request.RequestUri;
            return Redirect(requestUri.AbsoluteUri + "index.html");
        }

        public List<FitnesCentar> Get()
        {
            return Models.Repo.centri;
        }

        public IHttpActionResult Get(string naziv)
        {
            FitnesCentar retVal = null;
            foreach (var el in Models.Repo.centri)
            {
                if (el.Naziv.Equals(naziv)) { retVal = el; }
            }
            return Ok(retVal);
        }
    }
}
