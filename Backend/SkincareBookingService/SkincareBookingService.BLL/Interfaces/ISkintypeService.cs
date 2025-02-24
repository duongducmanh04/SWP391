using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISkintypeService
    {
        Task<List<SkintypeDTO>> GetSkintypesAsync();
    }
}
