using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.Core.Constants;
using SkincareBookingService.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IBookingService
    {
        Task<BookingDTO> CreateBookingAsync(BookingDTO bookingDTO);
        Task<List<Booking>> GetBookingsAsync();

        Task<List<Booking>> GetBookingsByStatusAsync(string status);

        Task<Booking> GetBookingByIdAsync(int bookingId);

        Task<bool> UpdateBookingStatusToCheckInAsync(int bookingId);

        Task<bool> UpdateStatusToCompletedAsync(int bookingId);

        Task<bool> UpdateStatusToDeniedAsync(int bookingId);

        Task<bool> UpdateStatusToCancelledAsync(int bookingId);

        Task<bool> UpdateStatusToFinishedAsync(int bookingId);

        Task<bool> UpdateBookingServiceAsync(int bookingId, string serviceName);

        Task<bool> DeleteBookingAsync(int bookingId);
    }
}
