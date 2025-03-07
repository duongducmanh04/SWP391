using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISkintypeServiceService
    {
        Task<List<SkintypeServiceDTO>> GetSkintypeServicesAsync();

        Task<SkintypeServiceDTO> GetSkintypeServiceByIdAsync(int id);
    }
}
