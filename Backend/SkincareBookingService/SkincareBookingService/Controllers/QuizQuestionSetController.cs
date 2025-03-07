using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizQuestionSetController : ControllerBase
    {
        private readonly IQuizQuestionSetService _quizQuestionSetService;

        public QuizQuestionSetController(IQuizQuestionSetService quizQuestionSetService)
        {
            _quizQuestionSetService = quizQuestionSetService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuizQuestionSets()
        {
            var quizQuestionSets = await _quizQuestionSetService.GetAllQuestionsAsync();
            if (quizQuestionSets == null || quizQuestionSets.Count == 0)
            {
                return NotFound("No quiz question sets found");
            }
            return Ok(quizQuestionSets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuizQuestionSetById(int id)
        {
            var quizQuestionSet = await _quizQuestionSetService.GetQuestionByIdAsync(id);
            if (quizQuestionSet == null)
            {
                return NotFound("Quiz question set not found");
            }
            return Ok(quizQuestionSet);
        }
        [HttpPost]
        public async Task<IActionResult> Create(QuizQuestionSetPostDto dto)
        {
            var result = await _quizQuestionSetService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetQuizQuestionSetById), new { id = result.QuestionsId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, QuizQuestionSetPutDto dto)
        {
            var success = await _quizQuestionSetService.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _quizQuestionSetService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
