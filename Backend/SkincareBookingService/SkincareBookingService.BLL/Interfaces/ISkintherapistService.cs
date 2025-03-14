using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISkintherapistService
    {
        Task<SkinTherapistDTO> AddSkintherapistAsync(SkinTherapistDTO skintherapistDTO);
        Task<List<SkinTherapistDTO>> GetSkintherapistsAsync();
        Task<SkinTherapistDTO> GetSkintherapistByIdAsync(int id);
        Task<List<SkinTherapistDTO>> GetListSkintherapistByServiceId(int serviceId);

        Task<bool> UpdateSkintherapistAsync(SkinTherapistDTO skintherapistDTO);

        Task<bool> DeleteSkintherapistAsync(int id);
    }
}
