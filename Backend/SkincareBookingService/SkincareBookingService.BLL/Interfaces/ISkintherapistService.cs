using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISkintherapistService
    {
        Task<List<SkinTherapistDTO>> GetSkintherapistsAsync();
        Task<SkinTherapistDTO> GetSkintherapistByIdAsync(int id);
        Task<List<SkinTherapistDTO>> GetListSkintherapistByServiceId(int serviceId);
    }
}
