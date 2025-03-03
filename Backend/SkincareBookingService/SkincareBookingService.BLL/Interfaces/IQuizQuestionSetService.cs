using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IQuizQuestionSetService
    {
        Task<List<QuizQuestionSetDTO>> GetAllQuestionsAsync();

        Task<QuizQuestionSetDTO> GetQuestionByIdAsync(int id);
    }
}
