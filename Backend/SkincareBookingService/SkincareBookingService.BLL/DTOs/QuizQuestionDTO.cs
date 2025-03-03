namespace SkincareBookingService.BLL.DTOs
{
    public class QuizQuestionDTO
    {
        public int QuizquestionId { get; set; }
        public string Content { get; set; }
        public int? QuestionsId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<QuizAnswerDTO> QuizAnswers { get; set; }

    }
}
