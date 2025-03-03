using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IQuizAnswerService
    {
        Task<List<QuizAnswerDTO>> GetAllQuizAnswers();

        Task<QuizAnswerDTO> GetQuizAnswerById(int id);
    }
}
