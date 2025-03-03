using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class CustomerSurveyAnswerService : ICustomerSurveyAnswerService
    {
        private readonly IGenericRepository<CustomerSurveyAnswer> _customerSurveyAnswerRepository;
        public CustomerSurveyAnswerService(IGenericRepository<CustomerSurveyAnswer> customerSurveyAnswerRepository)
        {
            _customerSurveyAnswerRepository = customerSurveyAnswerRepository;
        }

        public async Task<List<CustomerSurveyAnswerDTO>> GetAllAsync()
        {
            var customerSurveyAnswers = await _customerSurveyAnswerRepository.GetAllAsync();

            if (customerSurveyAnswers == null)
            {
                return null;
            }

            return customerSurveyAnswers.Select(c => new CustomerSurveyAnswerDTO
            {
                CustomersurveyanswerId = c.CustomersurveyanswerId,
                CustomersurveyId = c.CustomersurveyId,
                AnswerId = c.AnswerId
            }).ToList();
        }

        public async Task<CustomerSurveyAnswerDTO> GetByIdAsync(int id)
        {
            var customerSurveyAnswer = await _customerSurveyAnswerRepository.GetByIdAsync(id);

            if (customerSurveyAnswer == null)
            {
                return null;
            }

            return new CustomerSurveyAnswerDTO
            {
                CustomersurveyanswerId = customerSurveyAnswer.CustomersurveyanswerId,
                CustomersurveyId = customerSurveyAnswer.CustomersurveyId,
                AnswerId = customerSurveyAnswer.AnswerId
            };
        }
    }
}
