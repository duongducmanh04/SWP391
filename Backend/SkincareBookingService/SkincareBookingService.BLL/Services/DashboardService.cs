using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.DTOs.DashboardDTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.BLL.Constants;
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
        private readonly IGenericRepository<Schedule> _scheduleRepository;

        public DashboardService(
            IGenericRepository<Booking> bookingRepository,
            IGenericRepository<Customer> customerRepository,
            IGenericRepository<SkinTherapist> skinTherapistRepository,
            IGenericRepository<Account> accountRepository,
            IGenericRepository<Schedule> scheduleRepository)
        {
            _bookingRepository = bookingRepository;
            _customerRepository = customerRepository;
            _skinTherapistRepository = skinTherapistRepository;
            _accountRepository = accountRepository;
            _scheduleRepository = scheduleRepository;
        }

        public async Task<DashboardSummaryDTO> GetDashboardSummaryAsync()
        {
            var totalBookings = await _bookingRepository.Query().CountAsync();
            var totalCustomers = await _customerRepository.Query().CountAsync();
            var totalSkintherapists = await _skinTherapistRepository.Query().CountAsync();
            var totalRevenue = await _bookingRepository.Query().SumAsync(b => b.Status == BookingStatus.Completed.ToString() ? b.Amount : 0);

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
                .Where(b => b.Date.HasValue && b.Date.Value.Year == year && b.Status == BookingStatus.Completed.ToString())
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

        private async Task<string> GetSkinTherapistNameById(int skinTherapistId)
        {
            var skinTherapist = await _skinTherapistRepository.GetByIdAsync(skinTherapistId);
            return skinTherapist?.Name;
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
                .Where(b => b.Date.HasValue && b.Date.Value.Year == year && b.Date.Value.Month == month 
                                            && b.Status == BookingStatus.Completed.ToString())
                .SumAsync(b => b.Amount);

            return (decimal)totalRevenue;
        }

        public async Task<List<TopSkintherapistDTO>> GetTopSkintherapistByYearAsync(int year)
        {
            var schedules = await _scheduleRepository.Query()
               .Where(s => s.Date.HasValue && s.Date.Value.Year == year)
               .ToListAsync();

            var groupedByMonth = schedules
                .GroupBy(s => s.Date.Value.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    SkinTherapists = g.GroupBy(s => s.SkinTherapistId)
                                      .Select(st => new
                                      {
                                          SkinTherapistId = st.Key,
                                          NumberOfBookings = st.Count()
                                      })
                                      .OrderByDescending(st => st.NumberOfBookings)
                                      .ToList()
                })
                .ToList();

            var topSkintherapists = new List<TopSkintherapistDTO>();

            for (int month = 1; month <= 12; month++)
            {
                var monthGroup = groupedByMonth.FirstOrDefault(g => g.Month == month);
                if (monthGroup != null)
                {
                    var maxBookings = monthGroup.SkinTherapists.First().NumberOfBookings;
                    var topTherapists = monthGroup.SkinTherapists
                        .Where(st => st.NumberOfBookings == maxBookings)
                        .ToList();

                    foreach (var therapist in topTherapists)
                    {
                        topSkintherapists.Add(new TopSkintherapistDTO
                        {
                            SkinTherapistId = (int)therapist.SkinTherapistId,
                            SkinTherapistName = await GetSkinTherapistNameById((int)therapist.SkinTherapistId),
                            Month = month,
                            Year = year,
                            NumberOfBookings = therapist.NumberOfBookings
                        });
                    }
                }
                else
                {
                    topSkintherapists.Add(new TopSkintherapistDTO
                    {
                        SkinTherapistId = 0,
                        SkinTherapistName = "No bookings",
                        Month = month,
                        Year = year,
                        NumberOfBookings = 0
                    });
                }
            }

            return topSkintherapists;
        }
    }
}
