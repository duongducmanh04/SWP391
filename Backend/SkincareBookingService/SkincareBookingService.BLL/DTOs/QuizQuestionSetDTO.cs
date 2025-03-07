namespace SkincareBookingService.BLL.DTOs
{
    public class QuizQuestionSetDTO
    {
        public int QuestionsId { get; set; }
        public string Title { get; set; }
        public List<QuizQuestionDTO> QuizQuestions { get; set; }
    }
}
