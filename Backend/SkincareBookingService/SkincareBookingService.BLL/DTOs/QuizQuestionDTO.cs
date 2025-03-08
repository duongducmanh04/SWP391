namespace SkincareBookingService.BLL.DTOs
{
    public class QuizQuestionDTO
    {
        public int QuizquestionId { get; set; }
        public string Content { get; set; }
        public int? QuestionsId { get; set; }
        public List<QuizAnswerDTO> QuizAnswers { get; set; }

    }

    public class QuizQuestionGetDto
    {
        public int QuizquestionId { get; set; }
        public string Content { get; set; }
        public int? QuestionsId { get; set; }
    }

    public class QuizQuestionPostDto
    {
        public string Content { get; set; }
        public int? QuestionsId { get; set; }
    }

    public class QuizQuestionPutDto
    {
        public string Content { get; set; }
        public int? QuestionsId { get; set; }
    }

}
