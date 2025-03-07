namespace SkincareBookingService.BLL.DTOs
{
    public class QuizAnswerDTO
    {
        public int AnswerId { get; set; }
        public int? CustomerId { get; set; }
        public int? QuizquestionId { get; set; }
        public int? SkintypeId { get; set; }
        public string Answer { get; set; }
        public string ServiceImpact { get; set; }
    }
}
