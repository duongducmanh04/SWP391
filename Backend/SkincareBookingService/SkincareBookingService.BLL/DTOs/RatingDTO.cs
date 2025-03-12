namespace SkincareBookingService.BLL.DTOs
{
    public class RatingDto
    {
        public int RatingId { get; set; }
        public int CustomerId { get; set; }
        public DateTime? CreateAt { get; set; }
        public int? Stars { get; set; }
        public int ServiceId { get; set; }
        //More fields to show to the user
        public string? CustomerName { get; set; }
        public string? ServiceName { get; set; }
    }

    public class PostRatingDto
    {
        public int CustomerId { get; set; }
        public int? Stars { get; set; }
        public int ServiceId { get; set; }
    }

    public class PutRatingDto
    {
        public int? Stars { get; set; }
    }
}
