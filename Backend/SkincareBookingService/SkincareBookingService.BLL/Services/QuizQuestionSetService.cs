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
                QuizQuestions = q.QuizQuestions.Select(qq => new QuizQuestionDTO
                {
                    QuizquestionId = qq.QuizquestionId,
                    Content = qq.Content,
                    QuestionsId = qq.QuestionsId,
                    QuizAnswers = qq.QuizAnswers.Select(qa => new QuizAnswerDTO
                    {
                        //quizAnswerDTO has similar properties
                        AnswerId = qa.AnswerId,
                        Answer = qa.Answer
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
                QuizQuestions = quizQuestionSet.QuizQuestions.Select(qq => new QuizQuestionDTO
                {
                    QuizquestionId = qq.QuizquestionId,
                    Content = qq.Content,
                    QuestionsId = qq.QuestionsId,
                    QuizAnswers = qq.QuizAnswers.Select(qa => new QuizAnswerDTO
                    {
                        //quizAnswerDTO has similar properties
                        AnswerId = qa.AnswerId,
                        Answer = qa.Answer,
                    }).ToList()
                }).ToList()
            };
        }

        public async Task<QuizQuestionSetGetDto> CreateAsync(QuizQuestionSetPostDto dto)
        {
            var questionSet = new QuizQuestionSet { Title = dto.Title };
            await _quizQuestionSetRepository.AddAsync(questionSet);
            return new QuizQuestionSetGetDto { QuestionsId = questionSet.QuestionsId, Title = questionSet.Title };
        }

        public async Task<bool> UpdateAsync(int id, QuizQuestionSetPutDto dto)
        {
            var questionSet = await _quizQuestionSetRepository.GetByIdAsync(id);
            if (questionSet == null) return false;

            questionSet.Title = dto.Title;
            await _quizQuestionSetRepository.UpdateAsync(questionSet);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var questionSet = await _quizQuestionSetRepository.GetByIdAsync(id);
            if (questionSet == null) return false;

            await _quizQuestionSetRepository.DeleteAsync(questionSet);
            return true;
        }
    }
}
