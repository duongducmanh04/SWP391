namespace SkincareBookingService.BLL.DTOs.BookingDTOss
{
    public class BookingDTO
    {
        public int? BookingId { get; set; }
        public int CustomerId { get; set; }
        public string Location { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? CreateAt { get; set; }
        public string Status { get; set; }
        public decimal? Amount { get; set; }
        public int SkintherapistId { get; set; }
        public DateTime? UpdateAt { get; set; }
        public string ServiceName { get; set; }

        // Additional properties for display purposes
        public string CustomerName { get; set; }
        public string SkintherapistName { get; set; }
    }
}