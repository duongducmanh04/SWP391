using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.Services
{
    public class CustomerSurveyService : ICustomerSurveyService
    {
        private readonly IGenericRepository<CustomerSurvey> _customerSurveyRepository;

        public CustomerSurveyService(IGenericRepository<CustomerSurvey> customerSurveyRepository)
        {
            _customerSurveyRepository = customerSurveyRepository;
        }

        public async Task<List<CustomerSurveyDTO>> GetAllCustomerSurveysAsync()
        {
            var customerSurveys = await _customerSurveyRepository.GetAllAsync();

            if (customerSurveys == null)
            {
                return null;
            }

            return customerSurveys.Select(c => new CustomerSurveyDTO
            {
                CustomersurveyId = c.CustomersurveyId,
                Date = c.Date,
                SkintypeId = c.SkintypeId,
                QuestionsId = c.QuestionsId,
                CustomerId = c.CustomerId,
                CreatedAt = c.CreatedAt
            }).ToList();
        }

        public async Task<CustomerSurveyDTO> GetCustomerSurveyByIdAsync(int id)
        {
            var customerSurvey = await _customerSurveyRepository.GetByIdAsync(id);

            if (customerSurvey == null)
            {
                return null;
            }

            return new CustomerSurveyDTO
            {
                CustomersurveyId = customerSurvey.CustomersurveyId,
                Date = customerSurvey.Date,
                SkintypeId = customerSurvey.SkintypeId,
                QuestionsId = customerSurvey.QuestionsId,
                CustomerId = customerSurvey.CustomerId,
                CreatedAt = customerSurvey.CreatedAt
            };
        }
    }
}
