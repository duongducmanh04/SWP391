using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
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
        private readonly IGenericRepository<Slot> _slotRepository;

        public BookingService(IGenericRepository<Booking> bookingRepository, IGenericRepository<Slot> genericRepository)
        {
            _bookingRepository = bookingRepository;
            _slotRepository = genericRepository;
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

        public async Task<bool> CreateBooking(BookingDTO bookingDTO, int slotId)
        {
            Slot? slot = await _slotRepository
                .Query()
                .Where(s => s.SlotId == slotId)
                .FirstOrDefaultAsync();

            if (slot == null || slot.BookingId != null)
            {
                return false;
            }

            Booking newBooking = await MapBookingDTOtoBooking(bookingDTO);
            await _bookingRepository.AddAsync(newBooking);
            await _bookingRepository.SaveChangesAsync();

            slot.BookingId = newBooking.BookingId;
            slot.Status = "booked";
            await _slotRepository.UpdateAsync(slot);
            await _slotRepository.SaveChangesAsync();
            
            return true;
        }
        private async Task<Booking> MapBookingDTOtoBooking(BookingDTO bookingDTO)
        {
            Booking booking = new();
            booking.Status = bookingDTO.Status;
            booking.CustomerId = bookingDTO.CustomerId;
            booking.Location = bookingDTO.Location;
            booking.Date = bookingDTO.Date;
            booking.CreateAt = DateTime.Now;
            booking.Amount = bookingDTO.Amount;
            booking.SkintherapistId = bookingDTO.SkintherapistId;
            booking.ServiceName = bookingDTO?.ServiceName;

            return booking;
        }
    }
}
