using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;
        public RatingController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRatings()
        {
            return Ok(await _ratingService.GetRatingsAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRating(int id)
        {
            var rating = await _ratingService.GetRatingByIdAsync(id);
            if (rating == null) return NotFound();
            return Ok(rating);
        }

        [HttpGet("service/{serviceId}")]
        public async Task<IActionResult> GetRatingsByServiceId(int serviceId)
        {
            return Ok(await _ratingService.GetRatingsByServiceIdAsync(serviceId));
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetRatingsByCustomerId(int customerId)
        {
            return Ok(await _ratingService.GetRatingsByCustomerIdAsync(customerId));
        }
        [HttpPost]
        public async Task<IActionResult> CreateRating(PostRatingDto dto)
        {
            var rating = await _ratingService.CreateRatingAsync(dto);
            return CreatedAtAction(nameof(GetRating), new { id = rating.RatingId }, rating);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRating(int id, PutRatingDto dto)
        {
            var updated = await _ratingService.UpdateRatingAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRating(int id)
        {
            var deleted = await _ratingService.DeleteRatingAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
