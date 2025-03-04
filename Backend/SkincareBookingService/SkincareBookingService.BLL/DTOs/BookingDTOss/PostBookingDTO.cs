namespace SkincareBookingService.BLL.DTOs.BookingDTOss
{
    public class PostBookingDTO
    {
        public int CustomerId { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Status { get; set; } = "booked";
        public decimal? Amount { get; set; }
        public int SkintherapistId { get; set; }
        public int ServiceId { get; set; }
    }
}