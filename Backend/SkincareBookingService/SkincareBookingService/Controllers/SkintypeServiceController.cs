using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
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

        [HttpPost("addSkintypeService")]
        public async Task<IActionResult> AddSkintypeService([FromBody] SkintypeServiceDTO skintypeServiceDTO)
        {
            if (skintypeServiceDTO == null)
            {
                return BadRequest("SkintypeServiceDTO is null");
            }
            var newSkintypeService = await _skintypeServiceService.AddSkintypeServiceAsync(skintypeServiceDTO);
            return CreatedAtAction("AddSkintypeService", new { id = newSkintypeService.SkintypeServiceId }, newSkintypeService);
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

        [HttpGet("getSkintypeServiceByServiceId/{serviceId}")]
        public async Task<IActionResult> GetSkintypeServiceByServiceId(int serviceId)
        {
            var skintypeService = await _skintypeServiceService.GetSkintypeServiceByServiceIdAsync(serviceId);
            if (serviceId <= 0)
            {
                return NotFound("ServiceId should be >0");
            }
            else if (skintypeService == null)
            {
                return NotFound("No skintype service found with that serviceId");
            }
            return Ok(skintypeService);
        }

        [HttpGet("getSkintypeServiceBySkintypeId/{skintypeId}")]
        public async Task<IActionResult> GetSkintypeServiceBySkintypeId(int skintypeId)
        {
            var skintypeService = await _skintypeServiceService.GetSkintypeServiceBySkintypeIdAsync(skintypeId);
            if (skintypeId <= 0)
            {
                return NotFound("SkintypeId should be >0");
            }
            else if (skintypeService == null)
            {
                return NotFound("No skintype service found with that skintypeId");
            }
            return Ok(skintypeService);
        }
    }
}
