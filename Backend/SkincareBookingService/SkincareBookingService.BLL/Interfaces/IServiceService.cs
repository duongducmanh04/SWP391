using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IServiceService
    {
        Task<List<ServiceDTO>> GetServicesAsync();
        Task<ServiceDTO> GetServiceByIdAsync(int serviceId);
    }
}
