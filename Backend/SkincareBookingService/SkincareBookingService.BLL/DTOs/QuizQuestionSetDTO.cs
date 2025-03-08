namespace SkincareBookingService.BLL.DTOs
{
    public class QuizQuestionSetDTO
    {
        public int QuestionsId { get; set; }
        public string Title { get; set; }
        public List<QuizQuestionDTO> QuizQuestions { get; set; }
    }
    public class QuizQuestionSetGetDto
    {
        public int QuestionsId { get; set; }
        public string Title { get; set; }
    }

    public class QuizQuestionSetPostDto
    {
        public string Title { get; set; }
    }

    public class QuizQuestionSetPutDto
    {
        public string Title { get; set; }
    }
}
