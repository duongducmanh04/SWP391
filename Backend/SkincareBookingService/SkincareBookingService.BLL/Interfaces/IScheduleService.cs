using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IScheduleService
    {
        Task<List<ScheduleDTO>> GetAllBySkinTherapistId(int skinTherapistId);
        Task<List<List<ScheduleDTO>>> GetAllByServiceId(int serviceId);
    }
}
