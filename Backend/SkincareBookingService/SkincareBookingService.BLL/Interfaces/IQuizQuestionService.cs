using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IQuizQuestionService
    {
        Task<List<QuizQuestionDTO>> GetAllQuizQuestionsAsync();

        Task<QuizQuestionDTO> GetQuizQuestionByIdAsync(int id);
    }
}
