namespace SkincareBookingService.BLL.DTOs
{
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
