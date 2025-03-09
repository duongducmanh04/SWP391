using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.DTOs.DashboardDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDTO> GetDashboardSummaryAsync();

        Task<int> GetTotalBookingsInMonthAsync(int year, int month);

        Task<decimal> GetTotalRevenueInMonthAsync(int year, int month);

        Task<List<MonthlyBookingRevenueDTO>> GetMonthlyBookingRevenueAsync(int year);

        Task<List<RoleCountDTO>> GetRoleCountsAsync();

    }
}
