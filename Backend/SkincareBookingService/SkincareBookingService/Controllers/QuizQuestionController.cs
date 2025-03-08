using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;

namespace SkincareBookingService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizQuestionController : ControllerBase
    {
        private readonly IQuizQuestionService _quizQuestionService;

        public QuizQuestionController(IQuizQuestionService quizQuestionService)
        {
            _quizQuestionService = quizQuestionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuizQuestions()
        {
            var quizQuestions = await _quizQuestionService.GetAllQuizQuestionsAsync();
            if (quizQuestions == null || quizQuestions.Count == 0)
            {
                return NotFound("No quiz questions found");
            }
            return Ok(quizQuestions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuizQuestionById(int id)
        {
            var quizQuestion = await _quizQuestionService.GetQuizQuestionByIdAsync(id);
            if (quizQuestion == null)
            {
                return NotFound("Quiz question not found");
            }
            return Ok(quizQuestion);
        }
        [HttpPost]
        public async Task<IActionResult> Create(QuizQuestionPostDto dto)
        {
            var result = await _quizQuestionService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetQuizQuestionById), new { id = result.QuizquestionId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, QuizQuestionPutDto dto)
        {
            var success = await _quizQuestionService.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _quizQuestionService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
