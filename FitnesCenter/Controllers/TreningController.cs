using System;
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
            gtpe.Korisnik = BazePodataka.korisnikRepository.GetKorisnikByUsername(gtpe.Korisnik.Username);

            if (!BazePodataka.grupniTreninziRepository.ValidatePosetiTrening(gtpe))
            {
                return BadRequest();
            }

            if (BazePodataka.grupniTreninziRepository.AddPosetilacToGrupniTrening(gtpe.Id, gtpe.Korisnik))
            {
                return Ok(BazePodataka.korisnikRepository.GetKorisnikByUsername(gtpe.Korisnik.Username));
            }
            
            return BadRequest();
        }

        [HttpDelete]
        [Route("api/trening/ObrisiTrening")]
        public IHttpActionResult ObrisiTrening([FromBody]DeleteTreningBlocked trening)
        {
            if (BazePodataka.korisnikRepository.CheckIfBlocked(trening.Username))
            {
                return NotFound();
            }

            if (BazePodataka.grupniTreninziRepository.DeleteTrening(trening.Id))
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPut]
        [Route("api/trening/IzmeniTrening")]
        public IHttpActionResult IzmeniTrening([FromBody]GrupniTreningCreationClass trening)
        {
            if (BazePodataka.korisnikRepository.CheckIfBlocked(trening.TrenerUsername))
            {
                return NotFound();
            }

            if (!BazePodataka.grupniTreninziRepository.CheckIfExists(trening.Trening.Id))
            {
                return BadRequest();
            }

            if (BazePodataka.grupniTreninziRepository.UpdateGrupniTrening(trening.Trening))
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("api/trening/DodajTrening")]
        public IHttpActionResult DodajTrening([FromBody]GrupniTreningCreationClass trening)
        {
            if (BazePodataka.korisnikRepository.CheckIfBlocked(trening.TrenerUsername))
            {
                return NotFound();
            }

            trening.Trening.Id = Guid.NewGuid();
            trening.Trening.FitnesCentar = BazePodataka.fitnesCentarRepository.GetFitnesCentarByNaziv(trening.FitnesCentarId);
            GrupniTrening retVal = BazePodataka.grupniTreninziRepository.AddGrupniTrening(trening);

            if (retVal == null)
            {
                return BadRequest();
            }

            if (retVal.Id == trening.Trening.Id)
            {
                Korisnik trener = BazePodataka.korisnikRepository.GetKorisnikByUsername(trening.TrenerUsername);

                return Ok(trener);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("api/trening/SpisakPosetiocaTrening")]
        public IHttpActionResult SpisakPosetiocaTrening(Guid id, string username)
        {
            if (BazePodataka.korisnikRepository.CheckIfBlocked(username))
            {
                return BadRequest();
            }

            GrupniTrening trening = BazePodataka.grupniTreninziRepository.GetGrupniTreningByNaziv(id);
            List<Korisnik> retVal = new List<Korisnik>();

            foreach (var el in trening.Posetioci) { retVal.Add(el); }

            if (retVal.Count == 0){ return NotFound(); }

            return Ok(retVal);
        }

        [HttpGet]
        [Route("api/trening/GetAllTrenings")]
        public IHttpActionResult GetAllTrenings([FromUri]Guid centarId)
        {
            List<GrupniTrening> retVal = BazePodataka.grupniTreninziRepository.GetGrupneTreningeForCentar(centarId);

            if (retVal.Count == 0) { return BadRequest(); }

            return Ok(retVal);
        }
    }
}
