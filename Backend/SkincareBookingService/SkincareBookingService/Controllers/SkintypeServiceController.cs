using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class SkintypeServiceController : ControllerBase
    {
        private readonly ISkintypeServiceService _skintypeServiceService;
        public SkintypeServiceController(ISkintypeServiceService skintypeServiceService)
        {
            _skintypeServiceService = skintypeServiceService;
        }

        [HttpGet("getSkintypeServices")]
        public async Task<IActionResult> GetSkintypeServices()
        {
            var skintypeServices = await _skintypeServiceService.GetSkintypeServicesAsync();
            if (skintypeServices == null || skintypeServices.Count == 0)
            {
                return NotFound("No skintype services found");
            }
            return Ok(skintypeServices);
        }

        [HttpGet("getSkintypeServiceById/{id}")]
        public async Task<IActionResult> GetSkintypeServiceById(int id)
        {
            var skintypeService = await _skintypeServiceService.GetSkintypeServiceByIdAsync(id);
            if (id <= 0)
            {
                return NotFound("Id should be >0");
            }
            else if (skintypeService == null)
            {
                return NotFound("No skintype service found with that id");
            }
            return Ok(skintypeService);
        }
    }
}
