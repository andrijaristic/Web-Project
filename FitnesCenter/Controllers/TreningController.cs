﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FitnesCenter.Models;
using FitnesCenter.Repository;

namespace FitnesCenter.Controllers
{
    // public string IdGrupniTrening { get; set; }
    // public Korisnik Korisnik { get; set; }
    //
    public class TreningController : ApiController
    {
        [HttpPost]
        [Route("api/trening/PosetiTrening")]
        public IHttpActionResult PosetiTrening([FromBody]GrupniTreningPosetilacEntity gtpe)
        {
            if (BazePodataka.grupniTreninziRepository.AddPosetilacToGrupniTrening(gtpe.NazivGrupniTrening, gtpe.Korisnik))
            {
                return Ok(gtpe.Korisnik);
            }
            
            return BadRequest();
        }

        [HttpDelete]
        [Route("api/trening/ObrisiTrening")]
        public IHttpActionResult ObrisiTrening([FromUri]string naziv)
        {
            if (BazePodataka.grupniTreninziRepository.DeleteTrening(naziv))
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPut]
        [Route("api/trening/IzmeniTrening")]
        public IHttpActionResult IzmeniTrening([FromBody]GrupniTrening trening)
        {
            if (BazePodataka.grupniTreninziRepository.UpdateGrupniTrening(trening))
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("api/trening/DodajTrening")]
        public IHttpActionResult DodajTrening([FromBody]GrupniTrening trening)
        {
            if (BazePodataka.grupniTreninziRepository.AddGrupniTrening(trening))
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("api/trening/SpisakPosetiocaTrening")]
        public IHttpActionResult SpisakPosetiocaTrening([FromUri]string naziv)
        {
            GrupniTrening trening = BazePodataka.grupniTreninziRepository.GetGrupniTreningByNaziv(naziv);
            List<Korisnik> retVal = new List<Korisnik>();
            
            foreach (var el in trening.Posetioci)
            {
                retVal.Add(el);
            }

            if (retVal.Count == 0)
            {
                return BadRequest();
            }

            return Ok(retVal);
        }
    }
}