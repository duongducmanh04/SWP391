using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.Core.Constants;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

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

        public async Task<BookingDTO> CreateBookingAsync(BookingDTO bookingDTO)
        {
            var booking = new Booking
            {
                CustomerId = bookingDTO.CustomerId,
                Location = bookingDTO.Location,
                Date = bookingDTO.Date,
                CreateAt = bookingDTO.CreateAt ?? DateTime.UtcNow,
                Status = bookingDTO.Status,
                Amount = bookingDTO.Amount,
                SkintherapistId = bookingDTO.SkintherapistId,
                UpdateAt = bookingDTO.UpdateAt,
                ServiceName = bookingDTO.ServiceName
            };

            await _bookingRepository.AddAsync(booking);

            var createdBookingDTO = new BookingDTO
            {
                BookingId = booking.BookingId,
                CustomerId = booking.CustomerId,
                Location = booking.Location,
                Date = booking.Date,
                CreateAt = booking.CreateAt,
                Status = booking.Status,
                Amount = booking.Amount,
                SkintherapistId = booking.SkintherapistId,
                UpdateAt = booking.UpdateAt,
                ServiceName = booking.ServiceName,
                // Assuming the related navigation properties are loaded, otherwise you may need to load them.
                CustomerName = booking.Customer?.Name,
                SkintherapistName = booking.Skintherapist?.Name
            };

            await _bookingRepository.SaveChangesAsync();
            return createdBookingDTO;
        }

        public async Task<bool> DeleteBookingAsync(int bookingId)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) return false;

            await _bookingRepository.DeleteAsync(booking);
            await _bookingRepository.SaveChangesAsync();
            return true;

        }

        public async Task<bool> UpdateBookingServiceAsync(int bookingId, string serviceName)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) return false;

            booking.ServiceName = serviceName;
            await _bookingRepository.UpdateAsync(booking);
            await _bookingRepository.SaveChangesAsync();
            return true;
        }
    }
}
