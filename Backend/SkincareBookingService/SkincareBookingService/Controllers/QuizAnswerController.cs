using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizAnswerController : ControllerBase
    {
        private readonly IQuizAnswerService _service;

        public QuizAnswerController(IQuizAnswerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(QuizAnswerPostDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.AnswerId }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, QuizAnswerPutDto dto)
        {
            var success = await _service.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
        [HttpGet("/GetByQuizquestionId/{id}")]
        public async Task<IActionResult> GetByQuizquestionId(int id)
        {
            if(id <= 0) return BadRequest("Invalid id");

            return Ok(await _service.GetAnswerByQuizquestionId(id));
        }
        [HttpGet("/GetBySkinTypeId/{id}")]
        public async Task<IActionResult> GetBySkinTypeId(int id)
        {
            if (id <= 0) return BadRequest("Invalid id");

            return Ok(await _service.GetAnswerBySkinTypeId(id));
        }
    }
}
