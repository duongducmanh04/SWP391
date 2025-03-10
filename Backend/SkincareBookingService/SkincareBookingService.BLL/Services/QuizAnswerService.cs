using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<QuizAnswerGetDto>> GetAllAsync()
        {
            var answers = await _quizAnswerRepository
                .Query()
                .ToListAsync();
            List<QuizAnswerGetDto> result = new();
            foreach(var answer in answers)
            {
                result.Add(new QuizAnswerGetDto
                {
                    AnswerId = answer.AnswerId,
                    QuizquestionId = answer.QuizquestionId,
                    SkintypeId = answer.SkintypeId,
                    Answer = answer.Answer,
                    ServiceImpact = answer.ServiceImpact
                });
            }
            return result;
        }

        public async Task<QuizAnswerGetDto> GetByIdAsync(int id)
        {
            var answer = await _quizAnswerRepository.GetByIdAsync(id);
            if(answer == null) return null;

            return new QuizAnswerGetDto
            {
                AnswerId = answer.AnswerId,
                QuizquestionId = answer.QuizquestionId,
                SkintypeId = answer.SkintypeId,
                Answer = answer.Answer,
                ServiceImpact = answer.ServiceImpact
            };
        }

        public async Task<QuizAnswerGetDto> CreateAsync(QuizAnswerPostDto dto)
        {
            var answer = new QuizAnswer
            {
                QuizquestionId = dto.QuizquestionId,
                SkintypeId = dto.SkintypeId,
                Answer = dto.Answer,
                ServiceImpact = dto.ServiceImpact
            };
            await _quizAnswerRepository.AddAsync(answer);
            var result = new QuizAnswerGetDto
            {
                AnswerId = answer.AnswerId,
                QuizquestionId = answer.QuizquestionId,
                SkintypeId = answer.SkintypeId,
                Answer = answer.Answer,
                ServiceImpact = answer.ServiceImpact
            };
            return result;
        }

        public async Task<bool> UpdateAsync(int id, QuizAnswerPutDto dto)
        {
            var answer = await _quizAnswerRepository.GetByIdAsync(id);
            if (answer == null) return false;

            answer.QuizquestionId = dto.QuizquestionId;
            answer.SkintypeId = dto.SkintypeId;
            answer.Answer = dto.Answer;
            answer.ServiceImpact = dto.ServiceImpact;
            await _quizAnswerRepository.UpdateAsync(answer);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var answer = await _quizAnswerRepository.GetByIdAsync(id);
            if (answer == null) return false;

            await _quizAnswerRepository.DeleteAsync(answer);
            return true;
        }

        public async Task<IEnumerable<QuizAnswerGetDto>> GetAnswerByQuizquestionId(int id)
        {
            var answers = await _quizAnswerRepository
                .Query()
                .Where(a => a.QuizquestionId == id)
                .ToListAsync();
            List<QuizAnswerGetDto> result = new();
            foreach (var answer in answers)
            {
                result.Add(new QuizAnswerGetDto
                {
                    AnswerId = answer.AnswerId,
                    QuizquestionId = answer.QuizquestionId,
                    SkintypeId = answer.SkintypeId,
                    Answer = answer.Answer,
                    ServiceImpact = answer.ServiceImpact
                });
            }
            return result;
        }

        public async Task<IEnumerable<QuizAnswerGetDto>> GetAnswerBySkinTypeId(int id)
        {
            var answers = await _quizAnswerRepository
                .Query()
                .Where(a => a.SkintypeId == id)
                .ToListAsync();
            List<QuizAnswerGetDto> result = new();
            foreach (var answer in answers)
            {
                result.Add(new QuizAnswerGetDto
                {
                    AnswerId = answer.AnswerId,
                    QuizquestionId = answer.QuizquestionId,
                    SkintypeId = answer.SkintypeId,
                    Answer = answer.Answer,
                    ServiceImpact = answer.ServiceImpact
                });
            }
            return result;
        }
    }
}
