using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace FitnesCenter.Models
{
    public class Enums
    {
        public enum Pol
        {
            MUSKI,
            ZENSKI
        }

        public enum Uloge
        {
            POSETILAC,
            TRENER,
            VLASNIK
        }

        public enum TipTreninga
        {
            YOGA,
            LES_MILLS_TONE,
            BODY_PUMP,
        }
    }
}