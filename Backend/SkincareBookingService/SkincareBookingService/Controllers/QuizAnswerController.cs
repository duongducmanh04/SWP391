using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class QuizAnswerController : ControllerBase
    {
        private readonly IQuizAnswerService _quizAnswerService;
        public QuizAnswerController(IQuizAnswerService quizAnswerService)
        {
            _quizAnswerService = quizAnswerService;
        }

        [HttpGet("getAllQuizAnswers")]
        public async Task<IActionResult> GetAllQuizAnswers()
        {
            var quizAnswers = await _quizAnswerService.GetAllQuizAnswers();
            if (quizAnswers == null || quizAnswers.Count == 0)
            {
                return NotFound("No quiz answers found");
            }
            return Ok(quizAnswers);
        }

        [HttpGet("getQuizAnswerById/{id}")]
        public async Task<IActionResult> GetQuizAnswerById(int id)
        {
            var quizAnswer = await _quizAnswerService.GetQuizAnswerById(id);
            if (quizAnswer == null)
            {
                return NotFound("Quiz answer not found");
            }
            return Ok(quizAnswer);
        }
    }
}
