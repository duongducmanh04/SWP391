using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IQuizAnswerService
    {
        Task<IEnumerable<QuizAnswerGetDto>> GetAllAsync();
        Task<QuizAnswerGetDto> GetByIdAsync(int id);
        Task<QuizAnswerGetDto> CreateAsync(QuizAnswerPostDto dto);
        Task<bool> UpdateAsync(int id, QuizAnswerPutDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<QuizAnswerGetDto>> GetAnswerByQuizquestionId(int id);
        Task<IEnumerable<QuizAnswerGetDto>> GetAnswerBySkinTypeId(int id);
    }
}
