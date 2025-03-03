using SkincareBookingService.BLL.DTOs.BookingDTOss;
using SkincareBookingService.DAL.Entities;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IBookingService
    {
        Task<List<Booking>> GetBookingsAsync();

        Task<List<Booking>> GetBookingsByStatusAsync(string status);

        Task<Booking> GetBookingByIdAsync(int bookingId);

        Task<bool> UpdateBookingStatusToCheckInAsync(int bookingId);

        Task<bool> UpdateStatusToCompletedAsync(int bookingId);

        Task<bool> UpdateStatusToDeniedAsync(int bookingId);

        Task<bool> UpdateStatusToCancelledAsync(int bookingId);

        Task<bool> UpdateStatusToFinishedAsync(int bookingId);

        Task<bool> UpdateBookingServiceAsync(int bookingId, string serviceName); 

        Task<bool> UpdateBookingAmountAsync(int bookingId, decimal amount);

        Task<bool> UpdateBookingSkintherapistAsync(int bookingId, int skintherapistId);

        Task<bool> CreateBooking(PostBookingDTO booking, int slotId);
    }
}
