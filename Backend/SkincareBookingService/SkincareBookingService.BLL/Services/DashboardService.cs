using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs.DashboardDTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IGenericRepository<Booking> _bookingRepository;
        private readonly IGenericRepository<Customer> _customerRepository;
        private readonly IGenericRepository<SkinTherapist> _skinTherapistRepository;

        public DashboardService(
            IGenericRepository<Booking> bookingRepository,
            IGenericRepository<Customer> customerRepository,
            IGenericRepository<SkinTherapist> skinTherapistRepository)
        {
            _bookingRepository = bookingRepository;
            _customerRepository = customerRepository;
            _skinTherapistRepository = skinTherapistRepository;
        }

        public async Task<DashboardSummaryDTO> GetDashboardSummaryAsync()
        {
            var totalBookings = await _bookingRepository.Query().CountAsync();
            var totalCustomers = await _customerRepository.Query().CountAsync();
            var totalSkintherapists = await _skinTherapistRepository.Query().CountAsync();
            var totalRevenue = await _bookingRepository.Query().SumAsync(b => b.Amount);

            var dashboardSummary = new DashboardSummaryDTO
            {
                TotalBookings = totalBookings,
                TotalCustomers = totalCustomers,
                TotalRevenue = (decimal)totalRevenue,
                TotalSkintherapists = totalSkintherapists
            };

            return dashboardSummary;
        }

        public async Task<int> GetTotalBookingsInMonthAsync(int year, int month)
        {
            var totalBookings = await _bookingRepository.Query()
                .Where(b => b.Date.HasValue && b.Date.Value.Year == year && b.Date.Value.Month == month)
                .CountAsync();

            return totalBookings;
        }

        public async Task<decimal> GetTotalRevenueInMonthAsync(int year, int month)
        {
            var totalRevenue = await _bookingRepository.Query()
                .Where(b => b.Date.HasValue && b.Date.Value.Year == year && b.Date.Value.Month == month)
                .SumAsync(b => b.Amount);

            return (decimal)totalRevenue;
        }
    }
}
