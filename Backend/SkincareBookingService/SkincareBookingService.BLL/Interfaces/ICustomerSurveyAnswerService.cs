using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ICustomerSurveyAnswerService
    {
        Task<List<CustomerSurveyAnswerDTO>> GetAllAsync();

        Task<CustomerSurveyAnswerDTO> GetByIdAsync(int id);
    }
}
