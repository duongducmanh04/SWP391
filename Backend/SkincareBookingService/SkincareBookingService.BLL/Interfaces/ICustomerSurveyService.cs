using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ICustomerSurveyService
    {
        Task<List<CustomerSurveyDTO>> GetAllCustomerSurveysAsync();

        Task<CustomerSurveyDTO> GetCustomerSurveyByIdAsync(int id);
    }
}
