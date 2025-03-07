using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/skintherapist")]
    [ApiController]
    public class SkintherapistController : ControllerBase
    {
        private readonly ISkintherapistService _skintherapistService;

        public SkintherapistController(ISkintherapistService skintherapistService)
        {
            _skintherapistService = skintherapistService;
        }

        [HttpGet("getAllSkintherapist")]
        public async Task<IActionResult> GetSkintherapists()
        {
            var skintherapist = await _skintherapistService.GetSkintherapistsAsync();
            if (skintherapist == null || skintherapist.Count == 0)
            {
                return NotFound("No skintherapist found");
            }

            return Ok(skintherapist);
        }

        [HttpGet("getSkintherapistById/{id}")]
        public async Task<IActionResult> GetSkintherapistById(int id)
        {
            var skintherapist = await _skintherapistService.GetSkintherapistByIdAsync(id);
            if (skintherapist == null)
            {
                return NotFound("No skintherapist found");
            }
            return Ok(skintherapist);
        }
        [HttpGet("list-by-service/{id}")]
        public async Task<IActionResult> GetSkintherapistByServiceId(int id)
        {
            var skintherapistList = await _skintherapistService.GetListSkintherapistByServiceId(id);
            if (skintherapistList == null || skintherapistList.Count == 0)
            {
                return NotFound("No skintherapist found");
            }
            return Ok(skintherapistList);
        }
    }
}
