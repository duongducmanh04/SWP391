using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class QuizQuestionController : ControllerBase
    {
        private readonly IQuizQuestionService _quizQuestionService;

        public QuizQuestionController(IQuizQuestionService quizQuestionService)
        {
            _quizQuestionService = quizQuestionService;
        }

        [HttpGet("getAllQuizQuestions")]
        public async Task<IActionResult> GetAllQuizQuestions()
        {
            var quizQuestions = await _quizQuestionService.GetAllQuizQuestionsAsync();
            if (quizQuestions == null || quizQuestions.Count == 0)
            {
                return NotFound("No quiz questions found");
            }
            return Ok(quizQuestions);
        }

        [HttpGet("getQuizQuestionById/{id}")]
        public async Task<IActionResult> GetQuizQuestionById(int id)
        {
            var quizQuestion = await _quizQuestionService.GetQuizQuestionByIdAsync(id);
            if (quizQuestion == null)
            {
                return NotFound("Quiz question not found");
            }
            return Ok(quizQuestion);
        }
    }
}
