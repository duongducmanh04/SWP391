﻿using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs.CustomerSurveyDTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class CustomerSurveyController : ControllerBase
    {
        private readonly ICustomerSurveyService _customerSurveyService;

        public CustomerSurveyController(ICustomerSurveyService customerSurveyService)
        {
            _customerSurveyService = customerSurveyService;
        }

        [HttpPost("submitSurvey")]
        public async Task<IActionResult> SubmitSurvey([FromBody] SubmitSurveyDTO request)
        {
            if (request == null || request.Answers == null || request.Answers.Count == 0)
                return BadRequest("Invalid answers list");

            int surveyId = await _customerSurveyService.SubmitSurveyAsync(request);

            var recommendedSkinType = await _customerSurveyService.RecommendSkintypeAsync(surveyId);

            return Ok(new { surveyId, recommendedSkinType });
        }


        [HttpGet("getAllSurveys")]
        public async Task<IActionResult> GetAllSurveys()
        {
            var surveys = await _customerSurveyService.GetAllCustomerSurveysAsync();
            if (surveys == null || surveys.Count == 0)
            {
                return NotFound("No surveys found");
            }
            return Ok(surveys);
        }

        [HttpGet("getSurveyById/{id}")]
        public async Task<IActionResult> GetSurveyById(int id)
        {
            var survey = await _customerSurveyService.GetCustomerSurveyByIdAsync(id);
            if (survey == null)
            {
                return NotFound("Survey not found");
            }
            return Ok(survey);
        }

        [HttpGet("recommendSkintype/{customerSurveyId}")]
        public async Task<IActionResult> RecommendSkintype(int customerSurveyId)
        {
            var skinType = await _customerSurveyService.RecommendSkintypeAsync(customerSurveyId);
            if (skinType == null)
            {
                return NotFound("Skin type not found");
            }
            return Ok(skinType);
        }
    }
}
