using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IQuizQuestionSetService
    {
        Task<List<QuizQuestionSetDTO>> GetAllQuestionsAsync();

        Task<QuizQuestionSetDTO> GetQuestionByIdAsync(int id);

        Task<QuizQuestionSetGetDto> CreateAsync(QuizQuestionSetPostDto dto);
        Task<bool> UpdateAsync(int id, QuizQuestionSetPutDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
