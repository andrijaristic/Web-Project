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
                LoginStorageEntity logEntity = new LoginStorageEntity();  // AccessToken | Korisnik => sessionStorage

                logEntity.AccessToken = $"{loginInfo.Username}-{loginInfo.Password}";
                logEntity.Korisnik = korisnik;

                return Ok(logEntity);
            }

            return BadRequest();
        }

        // Obrisati logovanog korisnika iz spiksa ulogovanih na back-end.
        //
        [HttpPost]
        [Route("api/korisnik/LogoutKorisnik")]
        public IHttpActionResult LogoutKorisnik(Korisnik korisnik)
        {
            return BadRequest();
        }
    }
}
