using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs.ScheduleDTOs
{
    public class ScheduleInputDTO
    {
        public int ScheduleId { get; set; }
        public int? SkinTherapistId { get; set; }
        public int? SlotId { get; set; }
        public DateTime Date { get; set; }
    }

}
