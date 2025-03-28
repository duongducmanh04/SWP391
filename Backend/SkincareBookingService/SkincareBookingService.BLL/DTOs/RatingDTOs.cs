namespace SkincareBookingService.BLL.DTOs
{
    public class GetRatingDto
    {
        public int RatingId { get; set; }
        public int CustomerId { get; set; }
        public int ServiceId { get; set; }
        public DateTime? CreateAt { get; set; }
        public int Stars { get; set; }
        public string? Feedback { get; set; }
        //Fields to show for customer
        public string CustomerName = string.Empty;
        public string ServiceName = string.Empty;
    }
    public class PostRatingDto
    {
        public int CustomerId { get; set; }
        public int ServiceId { get; set; }
        public int Stars { get; set; }
        public string? Feedback { get; set; }
    }
    public class PutRatingDto
    {
        public int Stars { get; set; }
        public string? Feedback { get; set; }
    }

}

