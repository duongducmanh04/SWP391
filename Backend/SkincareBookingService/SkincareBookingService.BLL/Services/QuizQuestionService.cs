using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class QuizQuestionService : IQuizQuestionService
    {
        private readonly IGenericRepository<QuizQuestion> _quizQuestionRepository;

        public QuizQuestionService(IGenericRepository<QuizQuestion> quizQuestionRepository)
        {
            _quizQuestionRepository = quizQuestionRepository;
        }

        public async Task<List<QuizQuestionDTO>> GetAllQuizQuestionsAsync()
        {
            var quizQuestions = await _quizQuestionRepository.GetAllAsync();

            if (quizQuestions == null)
            {
                return null;
            }

            return quizQuestions.Select(q => new QuizQuestionDTO
            {
                QuizquestionId = q.QuizquestionId,
                Content = q.Content,
                QuestionsId = q.QuestionsId,
                CreatedAt = q.CreatedAt,
                QuizAnswers = q.QuizAnswers.Select(a => new QuizAnswerDTO
                {
                    AnswerId = a.AnswerId,
                    CustomerId = a.CustomerId,
                    QuizquestionId = a.QuizquestionId,
                    SkintypeId = a.SkintypeId,
                    Answer = a.Answer,
                    ServiceImpact = a.ServiceImpact,
                    CreatedAt = a.CreatedAt
                }).ToList()
            }).ToList();
        }

        public async Task<QuizQuestionDTO> GetQuizQuestionByIdAsync(int id)
        {
            var quizQuestion = await _quizQuestionRepository.GetByIdAsync(id);

            if (quizQuestion == null)
            {
                return null;
            }

            return new QuizQuestionDTO
            {
                QuizquestionId = quizQuestion.QuizquestionId,
                Content = quizQuestion.Content,
                QuestionsId = quizQuestion.QuestionsId,
                CreatedAt = quizQuestion.CreatedAt,
                QuizAnswers = quizQuestion.QuizAnswers.Select(a => new QuizAnswerDTO
                {
                    AnswerId = a.AnswerId,
                    CustomerId = a.CustomerId,
                    QuizquestionId = a.QuizquestionId,
                    SkintypeId = a.SkintypeId,
                    Answer = a.Answer,
                    ServiceImpact = a.ServiceImpact,
                    CreatedAt = a.CreatedAt
                }).ToList()
            };
        }
    }
}
