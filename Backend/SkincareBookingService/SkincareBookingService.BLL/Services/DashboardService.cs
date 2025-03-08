using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
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
        private readonly IGenericRepository<Account> _accountRepository;

        public DashboardService(
            IGenericRepository<Booking> bookingRepository,
            IGenericRepository<Customer> customerRepository,
            IGenericRepository<SkinTherapist> skinTherapistRepository,
            IGenericRepository<Account> accountRepository)
        {
            _bookingRepository = bookingRepository;
            _customerRepository = customerRepository;
            _skinTherapistRepository = skinTherapistRepository;
            _accountRepository = accountRepository;
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

        public async Task<List<MonthlyBookingRevenueDTO>> GetMonthlyBookingRevenueAsync(int year)
        {
            var monthlyData = await _bookingRepository.Query()
                .Where(b => b.Date.HasValue && b.Date.Value.Year == year)
                .GroupBy(b => b.Date.Value.Month)
                .Select(g => new MonthlyBookingRevenueDTO
                {
                    Month = g.Key,
                    TotalBookings = g.Count(),
                    TotalRevenue = g.Sum(b => b.Amount ?? 0)
                })
                .ToListAsync();

            var result = new List<MonthlyBookingRevenueDTO>();

            for (int month = 1; month <= 12; month++)
            {
                var data = monthlyData.FirstOrDefault(m => m.Month == month);
                if (data == null)
                {
                    result.Add(new MonthlyBookingRevenueDTO
                    {
                        Month = month,
                        TotalBookings = 0,
                        TotalRevenue = 0
                    });
                }
                else
                {
                    result.Add(data);
                }
            }

            return result;
        }

        public async Task<List<RoleCountDTO>> GetRoleCountsAsync()
        {
            var roleCounts = await _accountRepository.Query()
                .GroupBy(a => a.Role)
                .Select(g => new RoleCountDTO
                {
                    Role = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return roleCounts;
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
