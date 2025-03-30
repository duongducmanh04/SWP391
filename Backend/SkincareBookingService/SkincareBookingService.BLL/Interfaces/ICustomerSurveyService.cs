using SkincareBookingService.BLL.DTOs.CustomerSurveyDTOs;
using System.Security.Claims;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ICustomerSurveyService
    {
        Task<List<CustomerSurveyDTO>> GetAllCustomerSurveysAsync();

        Task<CustomerSurveyDTO> GetCustomerSurveyByIdAsync(int id);
        Task<string> RecommendSkintypeAsync(int customerSurveyId);

        Task<int> SubmitSurveyAsync(SubmitSurveyDTO request);
    }
}
