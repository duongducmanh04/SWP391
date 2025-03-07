using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISlotService
    {
        Task<bool> CreateSlotAsync(SlotDTO slot);

        Task<List<SlotDTO>> GetActiveSlotsAsync();

        Task<List<SlotDTO>> GetBookedSlotsAsync();

        Task<List<SlotDTO>> GetAllSlotsAsync();

        Task<SlotDTO> GetSlotByIdAsync(int id);

        Task<bool> UpdateSlotToActiveAsync(int id);

        Task<bool> UpdateSlotToBookedAsync(int id);

        Task<bool> UpdateSlotTimeAsync(int id, string time);

        Task<bool> UpdateSlotBookingIdAsync(int slotId, int bookingId);


    }
}
