using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class QuizAnswerService : IQuizAnswerService
    {
        private readonly IGenericRepository<QuizAnswer> _quizAnswerRepository;

        public QuizAnswerService(IGenericRepository<QuizAnswer> quizAnswerRepository)
        {
            _quizAnswerRepository = quizAnswerRepository;
        }

        public async Task<List<QuizAnswerDTO>> GetAllQuizAnswers()
        {
            var quizAnswers = await _quizAnswerRepository.GetAllAsync();

            if (quizAnswers == null)
            {
                return null;
            }

            return quizAnswers.Select(q => new QuizAnswerDTO
            {
                AnswerId = q.AnswerId,
                CustomerId = q.CustomerId,
                QuizquestionId = q.QuizquestionId,
                SkintypeId = q.SkintypeId,
                Answer = q.Answer,
                ServiceImpact = q.ServiceImpact,
                CreatedAt = q.CreatedAt
            }).ToList();
        }

        public async Task<QuizAnswerDTO> GetQuizAnswerById(int id)
        {
            var quizAnswer = await _quizAnswerRepository.GetByIdAsync(id);

            if (quizAnswer == null)
            {
                return null;
            }

            return new QuizAnswerDTO
            {
                AnswerId = quizAnswer.AnswerId,
                CustomerId = quizAnswer.CustomerId,
                QuizquestionId = quizAnswer.QuizquestionId,
                SkintypeId = quizAnswer.SkintypeId,
                Answer = quizAnswer.Answer,
                ServiceImpact = quizAnswer.ServiceImpact,
                CreatedAt = quizAnswer.CreatedAt
            };
        }
    }
}
