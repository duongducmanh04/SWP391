using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs.DashboardDTOs
{
    public class DashboardSummaryDTO
    {
        public int TotalBookings { get; set; }
        public int TotalCustomers { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalSkintherapists { get; set; }
    }
}
