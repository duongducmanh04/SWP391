namespace SkincareBookingService.BLL.DTOs.DashboardDTOs
{
    public class TopSkintherapistDTO
    {
        public int SkinTherapistId { get; set; }
        public string SkinTherapistName { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int NumberOfBookings { get; set; }
    }
}
