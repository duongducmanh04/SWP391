using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/skintype")]
    [ApiController]
    public class SkintypeController : ControllerBase
    {
        private readonly ISkintypeService _skintypeService; 

        public SkintypeController(ISkintypeService skintypeService)
        {
            _skintypeService = skintypeService;
        }

        [HttpGet("getAllSkintypes")]
        public async Task<IActionResult> GetSkintypes()
        {
            var skintypes = await _skintypeService.GetSkintypesAsync();
            if (skintypes == null || skintypes.Count == 0)
            {
                return NotFound("No skintypes found");
            }
            return Ok(skintypes);
        }
    }
}
