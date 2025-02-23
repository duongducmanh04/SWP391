using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISlotService
    {
        Task<List<SlotDTO>> GetActiveSlotsAsync();

        Task<List<SlotDTO>> GetBookedSlotsAsync();

        Task<List<SlotDTO>> GetAllSlotsAsync();

        Task<SlotDTO> GetSlotByIdAsync(int id);

        Task<bool> UpdateSlotToActiveAsync(int id);

        Task<bool> UpdateSlotToBookedAsync(int id);
    }
}
