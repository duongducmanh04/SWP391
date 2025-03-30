using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs
{
    public class SkintherapistServiceDTO
    {
        public int SkintherapistserviceId { get; set; }

        public string Name { get; set; }

        public string Speciality { get; set; }

        public string Email { get; set; }

        public string Experience { get; set; }

        public int? SkintherapistId { get; set; }

        public int? ServiceId { get; set; }
    }
}
