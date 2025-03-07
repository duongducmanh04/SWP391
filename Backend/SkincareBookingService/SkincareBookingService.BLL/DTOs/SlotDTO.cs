namespace SkincareBookingService.BLL.DTOs
{
    public class SlotDTO
    {
        public int SlotId { get; set; }
        public string Status { get; set; }
        public string Time { get; set; }
        public int? BookingId { get; set; }
        //Customized fields
        public DateTime Date { get; set; }
    }
}
