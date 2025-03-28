using SkincareBookingService.BLL.DTOs.BookingDTOss;
using SkincareBookingService.DAL.Entities;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IBookingService
    {
        Task<List<Booking>> GetBookingsAsync();

        Task<List<Booking>> GetBookingsByStatusAsync(string status);

        Task<Booking> GetBookingByIdAsync(int bookingId);

        Task<List<Booking>> GetBookingByCustomerIdAsync(int customerId);

        Task<List<Booking>> GetBookingBySkintherapistIdAsync(int skintherapistId);

        Task<List<Booking>> GetBookingByServiceIdAsync(int serviceId);

        Task<bool> UpdateBookingStatusToCheckInAsync(int bookingId);

        Task<bool> UpdateStatusToCompletedAsync(int bookingId);

        Task<bool> UpdateStatusToDeniedAsync(int bookingId);

        Task<bool> UpdateStatusToCancelledAsync(int bookingId);

        Task<bool> UpdateStatusToFinishedAsync(int bookingId);

        Task<bool > UpdateBookingAmountAsync(int bookingId, float amount);

        Task<bool> UpdateBookingServiceAsync(int bookingId, string serviceName); 

        Task<bool> UpdateBookingNoteAsync(int bookingId, string note);

        Task<bool> UpdateBookingDateAsync(int bookingId, DateTime date);

        Task<bool> UpdateBookingLocationAsync(int bookingId, string location);

        Task<bool> UpdateBookingSkintherapistAsync(int bookingId, int skintherapistId);

        Task<bool> CreateBooking(PostBookingDTO booking, int slotId);

        Task<List<BookingDTO>> GetBookingsByCustomerId(int customerId);
        Task<bool> CancelBookingByBookingId(int bookingId);
    }
}
