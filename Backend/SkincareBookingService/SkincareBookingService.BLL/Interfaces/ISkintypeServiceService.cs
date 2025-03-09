using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISkintypeServiceService
    {
        Task<List<SkintypeServiceDTO>> GetSkintypeServicesAsync();

        Task<SkintypeServiceDTO> GetSkintypeServiceByIdAsync(int id);

        Task<SkintypeServiceDTO> GetSkintypeServiceByServiceIdAsync(int serviceId);

        Task<SkintypeServiceDTO> GetSkintypeServiceBySkintypeIdAsync(int skintypeId);

        Task<SkintypeServiceDTO> AddSkintypeServiceAsync(SkintypeServiceDTO skintypeServiceDTO);
    }
}
