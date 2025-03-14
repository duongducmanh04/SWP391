using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.BLL.Services;

namespace SkincareBookingService.Controllers
{
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("getDashboardSummary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var dashboardSummary = await _dashboardService.GetDashboardSummaryAsync();
            return Ok(dashboardSummary);
        }

        [HttpGet("getTotalBookingsInMonth/{year}/{month}")]
        public async Task<IActionResult> GetTotalBookingsInMonth(int year, int month)
        {
            var totalBookings = await _dashboardService.GetTotalBookingsInMonthAsync(year, month);
            return Ok(totalBookings);
        }

        [HttpGet("getTotalRevenueInMonth/{year}/{month}")]
        public async Task<IActionResult> GetTotalRevenueInMonth(int year, int month)
        {
            var totalRevenue = await _dashboardService.GetTotalRevenueInMonthAsync(year, month);
            return Ok(totalRevenue);
        }

        [HttpGet("getMonthlyBookingRevenue/{year}")]
        public async Task<IActionResult> GetMonthlyBookingRevenue(int year)
        {
            var monthlyData = await _dashboardService.GetMonthlyBookingRevenueAsync(year);
            return Ok(monthlyData);
        }

        [HttpGet("getRoleCounts")]
        public async Task<IActionResult> GetRoleCounts()
        {
            var roleCounts = await _dashboardService.GetRoleCountsAsync();
            return Ok(roleCounts);
        }

        [HttpGet("getTopSkintherapistByYear/{year}")]
        public async Task<IActionResult> GetTopSkintherapistByYear(int year)
        {
            var topSkintherapists = await _dashboardService.GetTopSkintherapistByYearAsync(year);

            return Ok(topSkintherapists);
        }
    }
}
