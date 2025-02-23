using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IScheduleService
    {
        Task<List<ScheduleDTO>> GetAllByServiceIdAndSkinTherapistId(int serviceId, int? skinTherapistId);
    }
}
