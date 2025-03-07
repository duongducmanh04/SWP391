using SkincareBookingService.BLL.DTOs.CustomerSurveyDTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class CustomerSurveyService : ICustomerSurveyService
    {
        private readonly IGenericRepository<CustomerSurvey> _customerSurveyRepository;
        private readonly IGenericRepository<CustomerSurveyAnswer> _customerSurveyAnswerRepository;
        private readonly IGenericRepository<QuizAnswer> _quizAnswerRepository; 
        private readonly IGenericRepository<SkinType> _skinTypeRepository;

        public CustomerSurveyService(IGenericRepository<CustomerSurvey> customerSurveyRepository, IGenericRepository<CustomerSurveyAnswer> customerSurveyAnswerRepository, 
            IGenericRepository<QuizAnswer> quizAnswerRepository, IGenericRepository<SkinType> skinTypeRepository) 
        {
            _customerSurveyRepository = customerSurveyRepository;
            _customerSurveyAnswerRepository = customerSurveyAnswerRepository;
            _quizAnswerRepository = quizAnswerRepository;
            _skinTypeRepository = skinTypeRepository;
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

        public async Task<string> RecommendSkintypeAsync(int customerSurveyId)
        {
            var answers = await _customerSurveyAnswerRepository.FindAsync(a => a.CustomersurveyId == customerSurveyId);

            if (!answers.Any())
            {
                return "No answers found.";
            }

            var answerIds = answers.Select(a => a.AnswerId).ToList();
            var quizAnswers = await _quizAnswerRepository.FindAsync(qa => answerIds.Contains(qa.AnswerId));

            if (!quizAnswers.Any())
            {
                return "No recommendation available.";
            }

            // Find the most common skin type associated with the answers
            var mostCommonSkinTypeId = quizAnswers
                .GroupBy(qa => qa.SkintypeId)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault();

            if (mostCommonSkinTypeId == null)
            {
                return "Unknown Skin Type";
            }

            var skinType = await _skinTypeRepository.GetByIdAsync(mostCommonSkinTypeId.Value);
            return skinType?.SkintypeName ?? "Unknown Skin Type";
        }

    }
}
