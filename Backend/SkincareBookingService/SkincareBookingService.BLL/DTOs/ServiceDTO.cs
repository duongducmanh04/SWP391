namespace SkincareBookingService.BLL.DTOs
{
    public class ServiceDTO
    {
        public int ServiceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public string Image { get; set; } = string.Empty;
        public int? Duration { get; set; }
        public double? AverageStars { get; set; }
        public string ProcedureDescription { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
    }

}
