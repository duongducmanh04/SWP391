using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class QuizQuestionSetService : IQuizQuestionSetService
    {
        private readonly IGenericRepository<QuizQuestionSet> _quizQuestionSetRepository;

        public QuizQuestionSetService(IGenericRepository<QuizQuestionSet> quizQuestionSetRepository)
        {
            _quizQuestionSetRepository = quizQuestionSetRepository;
        }

        public async Task<List<QuizQuestionSetDTO>> GetAllQuestionsAsync()
        {
            var quizQuestionSets = await _quizQuestionSetRepository.GetAllAsync();

            if (quizQuestionSets == null)
            {
                return null;
            }

            return quizQuestionSets.Select(q => new QuizQuestionSetDTO
            {
                QuestionsId = q.QuestionsId,
                Title = q.Title,
                CreatedAt = q.CreatedAt,
                QuizQuestions = q.QuizQuestions.Select(qq => new QuizQuestionDTO
                {
                    QuizquestionId = qq.QuizquestionId,
                    Content = qq.Content,
                    QuestionsId = qq.QuestionsId,
                    CreatedAt = qq.CreatedAt,
                    QuizAnswers = qq.QuizAnswers.Select(qa => new QuizAnswerDTO
                    {
                        //quizAnswerDTO has similar properties
                        AnswerId = qa.AnswerId,
                        Answer = qa.Answer,
                        CreatedAt = qa.CreatedAt
                    }).ToList()
                }).ToList()
            }).ToList();
        }

        public async Task<QuizQuestionSetDTO> GetQuestionByIdAsync(int id)
        {
            var quizQuestionSet = await _quizQuestionSetRepository.GetByIdAsync(id);

            if (quizQuestionSet == null)
            {
                return null;
            }

            return new QuizQuestionSetDTO
            {
                QuestionsId = quizQuestionSet.QuestionsId,
                Title = quizQuestionSet.Title,
                CreatedAt = quizQuestionSet.CreatedAt,
                QuizQuestions = quizQuestionSet.QuizQuestions.Select(qq => new QuizQuestionDTO
                {
                    QuizquestionId = qq.QuizquestionId,
                    Content = qq.Content,
                    QuestionsId = qq.QuestionsId,
                    CreatedAt = qq.CreatedAt,
                    QuizAnswers = qq.QuizAnswers.Select(qa => new QuizAnswerDTO
                    {
                        //quizAnswerDTO has similar properties
                        AnswerId = qa.AnswerId,
                        Answer = qa.Answer,
                        CreatedAt = qa.CreatedAt
                    }).ToList()
                }).ToList()
            };
        }
    }
}
