using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISkintherapistServiceService
    {
        Task<List<SkintherapistServiceDTO>> GetAll();   

        Task<List<int>> GetServicesBySkintherapistIdAsync(int skintherapistId);
    }
}
