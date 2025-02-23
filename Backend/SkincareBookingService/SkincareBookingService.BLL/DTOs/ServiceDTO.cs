namespace SkincareBookingService.BLL.DTOs
{
    public class ServiceDTO
    {
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public string Image { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

}
