using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnesCenter.Models
{
    public class GrupniTrening
    {
        public Guid Id { get; set; }
        public string Naziv { get; set; }
        public Enums.TipTreninga TipTreninga { get; set; }
        public FitnesCentar FitnesCentar { get; set; }
        public int TrajanjeTreninga { get; set; }   // Trajanje u MINUTIMA.
        public DateTime DatumVreme { get; set; }    // Format: dd/MM/yyyy HH:mm
        public int MaksBrojPosetilaca { get; set; }
        public List<Korisnik> Posetioci { get; set; }  
        public bool isDeleted { get; set; }
    }
}