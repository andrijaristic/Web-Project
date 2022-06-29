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
            korisnik.Uloga = Enums.Uloge.POSETILAC;

            if (!BazePodataka.korisnikRepository.CheckIfKorisnikExists(korisnik.Username))
            {
                BazePodataka.korisnici.Add(korisnik);

                return Ok(korisnik);
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
        [HttpPost]
        [Route("api/korisnik/LogoutKorisnik")]
        public IHttpActionResult LogoutKorisnik(Korisnik korisnik)
        {
            return BadRequest();
        }

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
        public IHttpActionResult GetTreningeKorisnik(string username)
        {
            Korisnik korisnik = BazePodataka.korisnikRepository.GetKorisnikByUsername(username);
            List<GrupniTrening> retVal = new List<GrupniTrening>();

            if (korisnik.Uloga == Enums.Uloge.POSETILAC)
            {
                retVal = BazePodataka.grupniTreninziRepository.GetOdrzaneGrupneTreningeForPosetilac(korisnik.Username);
            } else if (korisnik.Uloga == Enums.Uloge.TRENER)
            {
                retVal = BazePodataka.grupniTreninziRepository.GetOdrzaneGrupneTreningeForTrener(korisnik.GrupniTreninziTrener);
            }


            if (retVal.Count == 0) { return NotFound(); } // NotFound - 404 | BadRequest - 400

            return Ok(retVal);
        }
    }
}
