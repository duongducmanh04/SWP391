using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class CustomerSurveyAnswerController : ControllerBase
    {
        private readonly ICustomerSurveyAnswerService _customerSurveyAnswerService;

        public CustomerSurveyAnswerController(ICustomerSurveyAnswerService customerSurveyAnswerService)
        {
            _customerSurveyAnswerService = customerSurveyAnswerService;
        }

        [HttpGet("getAllCustomerSurveyAnswers")]
        public async Task<IActionResult> GetAllCustomerSurveyAnswers()
        {
            var customerSurveyAnswers = await _customerSurveyAnswerService.GetAllAsync();
            if (customerSurveyAnswers == null || customerSurveyAnswers.Count == 0)
            {
                return NotFound("No customer survey answers found");
            }
            return Ok(customerSurveyAnswers);
        }

        [HttpGet("getCustomerSurveyAnswerById/{id}")]
        public async Task<IActionResult> GetCustomerSurveyAnswerById(int id)
        {
            var customerSurveyAnswer = await _customerSurveyAnswerService.GetByIdAsync(id);
            if (customerSurveyAnswer == null)
            {
                return NotFound("Customer survey answer not found");
            }
            return Ok(customerSurveyAnswer);
        }
    }
}
