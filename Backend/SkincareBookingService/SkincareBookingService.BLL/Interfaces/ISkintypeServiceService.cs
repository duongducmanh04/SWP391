using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISkintypeServiceService
    {
        Task<List<SkintypeServiceDTO>> GetSkintypeServicesAsync();

        Task<SkintypeServiceDTO> GetSkintypeServiceByIdAsync(int id);

        Task<List<SkintypeServiceDTO>> GetSkintypeServiceByServiceIdAsync(int serviceId);

        Task<List<SkintypeServiceDTO>> GetSkintypeServiceBySkintypeIdAsync(int skintypeId);

        Task<SkintypeServiceDTO> AddSkintypeServiceAsync(SkintypeServiceDTO skintypeServiceDTO);
    }
}
