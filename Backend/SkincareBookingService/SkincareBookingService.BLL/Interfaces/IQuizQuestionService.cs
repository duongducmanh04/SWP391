using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IQuizQuestionService
    {
        Task<List<QuizQuestionDTO>> GetAllQuizQuestionsAsync();

        Task<QuizQuestionDTO> GetQuizQuestionByIdAsync(int id);
        Task<QuizQuestionGetDto> CreateAsync(QuizQuestionPostDto dto);
        Task<bool> UpdateAsync(int id, QuizQuestionPutDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
