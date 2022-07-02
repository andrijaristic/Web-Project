using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using FitnesCenter.Models;
using FitnesCenter.Repository;

namespace FitnesCenter.Controllers
{
    public class KorisnikController : ApiController
    {
        [HttpPost]
        [Route("api/korisnik/RegisterKorisnik")]
        public IHttpActionResult RegisterKorisnik(Korisnik korisnik)
        {
            if (!BazePodataka.korisnikRepository.CheckIfKorisnikExists(korisnik.Username))
            {
                korisnik.GrupniTreninziPosetioc = new List<Guid>();
                korisnik.GrupniTreninziTrener = null;
                korisnik.FitnesCentarTrener = null;
                korisnik.FitnesCentarVlasnik = null;
                korisnik.isBlocked = false;

                BazePodataka.korisnici.Add(korisnik);

                BazePodataka.korisnikRepository.SaveToFile();
                return Ok(korisnik);
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("api/korisnik/RegisterTrener")]
        public IHttpActionResult RegisterTrener(RegisterTrener trener)
        {
            Korisnik trenerAdd = trener.Trener;
            trenerAdd.FitnesCentarTrener = BazePodataka.fitnesCentarRepository.GetFitnesCentarByNaziv(trener.FitnesCentarId);
            trenerAdd.FitnesCentarVlasnik = new List<Guid>();
            trenerAdd.GrupniTreninziPosetioc = new List<Guid>();
            trenerAdd.GrupniTreninziTrener = new List<GrupniTrening>();

            if (!BazePodataka.korisnikRepository.CheckIfKorisnikExists(trener.Trener.Username))
            {
                BazePodataka.korisnici.Add(trenerAdd);

                BazePodataka.korisnikRepository.SaveToFile();
                return Ok(trener);
            }

            return BadRequest();
        }

        //  Takodje dodaj korisnika na spisak ulogovanih na back-end.
        //
        [HttpPost]
        [Route("api/korisnik/LoginKorisnik")]
        public IHttpActionResult LoginKorisnik([FromBody]LoginInfo loginInfo)
        {
            if (BazePodataka.korisnikRepository.CheckIfKorisnikExists(loginInfo.Username))
            {
                Korisnik korisnik = BazePodataka.korisnikRepository.GetKorisnikByUsername(loginInfo.Username);
                if (!string.Equals(korisnik.Password, loginInfo.Password))
                {
                    return NotFound();
                }

                if (korisnik.isBlocked)
                {
                    return BadRequest();    // Blokiran.
                }

                LoginStorageEntity logEntity = new LoginStorageEntity
                {
                    AccessToken = $"{loginInfo.Username}-{loginInfo.Password}",
                    Korisnik = korisnik
                };  // AccessToken | Korisnik => sessionStorage

                return Ok(logEntity);
            }

            return NotFound(); // Ne postoji.
        }

        // Obrisati logovanog korisnika iz spiksa ulogovanih na back-end.
        //
        //[HttpPost]
        //[Route("api/korisnik/LogoutKorisnik")]
        //public IHttpActionResult LogoutKorisnik(Korisnik korisnik)
        //{
        //    return BadRequest();
        //}

        [HttpPut]
        [Route("api/korisnik/UpdateKorisnikInfo")]
        public IHttpActionResult UpdateKorisnikInfo(Korisnik korisnik)
        {
            string username = korisnik.Username;
            string oldUsername = korisnik.Username.Split('-')[0];
            string newUsername = korisnik.Username.Split('-')[1];
            korisnik.Username = oldUsername;

            if (BazePodataka.korisnikRepository.CheckIfKorisnikExists(korisnik.Username))
            {
                korisnik.Username = username;
                if (!BazePodataka.korisnikRepository.UpdateKorisnik(korisnik))
                {
                    return BadRequest();
                }
                korisnik.Username = newUsername;
                return Ok(korisnik);
            }
            return BadRequest();
        }

        // Svi odrzani treninzi.
        //
        [HttpGet]
        [Route("api/korisnik/GetTreningeKorisnik")]
        public IHttpActionResult GetTreningeKorisnik([FromUri]string username)
        {
            Korisnik korisnik = BazePodataka.korisnikRepository.GetKorisnikByUsername(username);
            if (korisnik == null)
            {
                return BadRequest();
            }

            List<GrupniTrening> retVal = new List<GrupniTrening>();

            if (korisnik.Uloga == Enums.Uloge.POSETILAC)
            {
                retVal = BazePodataka.grupniTreninziRepository.GetOdrzaneGrupneTreningeForPosetilac(korisnik);
            } else if (korisnik.Uloga == Enums.Uloge.TRENER)
            {
                retVal = BazePodataka.grupniTreninziRepository.GetOdrzaneGrupneTreningeForTrener(korisnik.GrupniTreninziTrener);
            }


            if (retVal.Count == 0) { return NotFound(); } // NotFound - 404 | BadRequest - 400

            return Ok(retVal);
        }

        [HttpPut]
        [Route("api/korisnik/BlockTrener")]
        public IHttpActionResult BlockTrener([FromUri]string username)
        {
            if (BazePodataka.korisnikRepository.CheckIfKorisnikExists(username))
            {
                int index = BazePodataka.korisnici.IndexOf(BazePodataka.korisnikRepository.GetKorisnikByUsername(username));
                BazePodataka.korisnici[index].isBlocked = true;

                BazePodataka.korisnikRepository.SaveToFile();
                return Ok();
            }

            return BadRequest();
        }
    }
}
