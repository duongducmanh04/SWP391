﻿using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs.BookingDTOss;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.Core.Constants;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class BookingService : IBookingService
    {
        private readonly IGenericRepository<Booking> _bookingRepository;
        private readonly IGenericRepository<Slot> _slotRepository;
        private readonly IGenericRepository<Service> _serviceRepository;
        private readonly IGenericRepository<Schedule> _scheduleRepository;
        public BookingService(IGenericRepository<Booking> bookingRepository, IGenericRepository<Slot> genericRepository, IGenericRepository<Service> serviceRepository, IGenericRepository<Schedule> scheduleRepository)
        {
            _bookingRepository = bookingRepository;
            _slotRepository = genericRepository;
            _serviceRepository = serviceRepository;
            _scheduleRepository = scheduleRepository;
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

        public async Task<bool> CreateBooking(PostBookingDTO booking, int slotId)
        {
            Slot? slot = await _slotRepository
                .Query()
                .Where(s => s.SlotId == slotId)
                .FirstOrDefaultAsync();

            if (slot == null || slot.BookingId != null)
            {
                return false;
            }

            Booking newBooking = new();
            //add property
            newBooking.CustomerId = booking.CustomerId;
            newBooking.ServiceId = booking.ServiceId;
            newBooking.Location = booking.Location;
            newBooking.CreateAt = DateTime.Now;
            newBooking.Status = BookingStatus.Booked.ToString();
            newBooking.Amount = booking.Amount;
            newBooking.SkintherapistId = booking.SkintherapistId;
            //Add date from slot
            newBooking.Date = await _scheduleRepository.Query()
                .Where(s => s.SlotId == slotId)
                .Select(s => s.Date.Value)
                .FirstOrDefaultAsync();
            //Add service name
            newBooking.ServiceName = await _serviceRepository.Query()
                .Where(s => s.ServiceId == booking.ServiceId)
                .Select(s => s.Name)
                .FirstOrDefaultAsync();

            await _bookingRepository.AddAsync(newBooking);
            await _bookingRepository.SaveChangesAsync();

            //update slot
            slot.BookingId = newBooking.BookingId;
            slot.Status = SlotStatus.Booked.ToString();

            await _slotRepository.UpdateAsync(slot);
            await _slotRepository.SaveChangesAsync();
            
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

        public async Task<bool> UpdateBookingAmountAsync(int bookingId, float amount)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) return false;

            booking.Amount = (decimal?)amount;
            await _bookingRepository.UpdateAsync(booking);
            await _bookingRepository.SaveChangesAsync();
            return true;
        }
    }
}
