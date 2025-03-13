using SkincareBookingService.DAL.Entities;

namespace SkincareBookingService.BLL.DTOs.ScheduleDTOs
{
    public class ScheduleDTO
    {
        public int ScheduleId { get; set; }

        public int? SkinTherapistId { get; set; }

        public int? SlotId { get; set; }

        public DateTime Date { get; set; }

        public virtual SkinTherapist? SkinTherapist { get; set; }

        public virtual Slot? Slot { get; set; }
    }
}
