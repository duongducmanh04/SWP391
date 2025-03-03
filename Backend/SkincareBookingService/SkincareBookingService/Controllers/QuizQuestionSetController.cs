using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class QuizQuestionSetController : ControllerBase
    {
        private readonly IQuizQuestionSetService _quizQuestionSetService;

        public QuizQuestionSetController(IQuizQuestionSetService quizQuestionSetService)
        {
            _quizQuestionSetService = quizQuestionSetService;
        }

        [HttpGet("getAllQuizQuestionSets")]
        public async Task<IActionResult> GetAllQuizQuestionSets()
        {
            var quizQuestionSets = await _quizQuestionSetService.GetAllQuestionsAsync();
            if (quizQuestionSets == null || quizQuestionSets.Count == 0)
            {
                return NotFound("No quiz question sets found");
            }
            return Ok(quizQuestionSets);
        }

        [HttpGet("getQuizQuestionSetById/{id}")]
        public async Task<IActionResult> GetQuizQuestionSetById(int id)
        {
            var quizQuestionSet = await _quizQuestionSetService.GetQuestionByIdAsync(id);
            if (quizQuestionSet == null)
            {
                return NotFound("Quiz question set not found");
            }
            return Ok(quizQuestionSet);
        }
    }
}
