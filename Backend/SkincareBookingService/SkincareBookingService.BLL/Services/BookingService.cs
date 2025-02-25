using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.Core.Constants;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.Services
{
    public class BookingService : IBookingService
    {
        private readonly IGenericRepository<Booking> _bookingRepository;

        public BookingService(IGenericRepository<Booking> bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<List<Booking>> GetBookingsAsync()
        {
            var bookings = await _bookingRepository.GetAllAsync();
            return bookings.ToList();
        }

        public async Task<List<Booking>> GetBookingsByStatusAsync(string status)
        {
            var bookings = await _bookingRepository.FindAsync(b => b.Status == status);
            return bookings.ToList();
        }

        public async Task<bool> UpdateBookingStatusToCheckInAsync(int bookingId)
        {
            return await UpdateBookingStatusAsync(bookingId, BookingStatus.CheckIn.ToString());
        }

        public async Task<bool> UpdateStatusToCompletedAsync(int bookingId)
        {
            return await UpdateBookingStatusAsync(bookingId, BookingStatus.Completed.ToString());
        }

        public async Task<bool> UpdateStatusToDeniedAsync(int bookingId)
        {
            return await UpdateBookingStatusAsync(bookingId, BookingStatus.Denied.ToString());
        }

        public async Task<bool> UpdateStatusToCancelledAsync(int bookingId)
        {
            return await UpdateBookingStatusAsync(bookingId, BookingStatus.Cancelled.ToString());
        }

        public async Task<bool> UpdateStatusToFinishedAsync(int bookingId)
        {
            return await UpdateBookingStatusAsync(bookingId, BookingStatus.Finished.ToString());
        }

        private async Task<bool> UpdateBookingStatusAsync(int bookingId, string status)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) return false;

            booking.Status = status;
            await _bookingRepository.UpdateAsync(booking);
            return true;
        }

        public async Task<Booking?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            return booking;
        }
    }
}
