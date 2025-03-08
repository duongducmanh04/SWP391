namespace SkincareBookingService.BLL.DTOs.DashboardDTOs
{
    public class MonthlyBookingRevenueDTO
    {
        public int Month { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
