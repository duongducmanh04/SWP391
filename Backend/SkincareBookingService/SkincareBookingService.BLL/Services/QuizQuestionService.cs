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
                QuizAnswers = q.QuizAnswers.Select(a => new QuizAnswerDTO
                {
                    AnswerId = a.AnswerId,
                    QuizquestionId = a.QuizquestionId,
                    SkintypeId = a.SkintypeId,
                    Answer = a.Answer,
                    ServiceImpact = a.ServiceImpact
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
                QuizAnswers = quizQuestion.QuizAnswers.Select(a => new QuizAnswerDTO
                {
                    AnswerId = a.AnswerId,
                    QuizquestionId = a.QuizquestionId,
                    SkintypeId = a.SkintypeId,
                    Answer = a.Answer,
                    ServiceImpact = a.ServiceImpact
                }).ToList()
            };
        }

        public async Task<QuizQuestionGetDto> CreateAsync(QuizQuestionPostDto dto)
        {
            var question = new QuizQuestion { Content = dto.Content, QuestionsId = dto.QuestionsId };
            await _quizQuestionRepository.AddAsync(question);
            return new QuizQuestionGetDto { QuizquestionId = question.QuizquestionId, Content = question.Content, QuestionsId = question.QuestionsId };
        }

        public async Task<bool> UpdateAsync(int id, QuizQuestionPutDto dto)
        {
            var question = await _quizQuestionRepository.GetByIdAsync(id);
            if (question == null) return false;

            question.Content = dto.Content;
            question.QuestionsId = dto.QuestionsId;
            await _quizQuestionRepository.UpdateAsync(question);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var question = await _quizQuestionRepository.GetByIdAsync(id);
            if (question == null) return false;

            await _quizQuestionRepository.DeleteAsync(question);
            return true;
        }
    }
}
