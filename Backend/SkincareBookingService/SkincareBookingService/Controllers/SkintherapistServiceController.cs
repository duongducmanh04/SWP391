using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/skintherapist-service")]
    [ApiController]
    public class SkintherapistServiceController : Controller
    {
        private readonly ISkintherapistServiceService _skintherapistService;

        public SkintherapistServiceController(ISkintherapistServiceService skintherapistService)
        {
            _skintherapistService = skintherapistService;
        }

        [HttpGet("getSkintherapistService")]
        public async Task<IActionResult> GetSkintherapistService()
        {
            var skintherapistService = await _skintherapistService.GetAll();
            if (skintherapistService == null)
            {
                return NotFound("No skintherapist service found");
            }
            return Ok(skintherapistService);
        }

        [HttpGet("getServicesBySkintherapistId/{id}")]
        public async Task<IActionResult> GetServicesBySkintherapistId(int id)
        {
            var services = await _skintherapistService.GetServicesBySkintherapistIdAsync(id);
            if (services == null)
            {
                return NotFound("No services found");
            }
            return Ok(services);
        }
    }
}
