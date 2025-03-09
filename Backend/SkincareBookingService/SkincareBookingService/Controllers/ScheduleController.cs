using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.BLL.Services;

namespace SkincareBookingService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;

        public ScheduleController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }
        // Show all schedules of the service that assigned to the skin therapist
        [HttpGet("/search-by-skintherapist/{skintherapistId}")]
        public async Task<IActionResult> GetSchedulesBySkinTherapistID(int skintherapistId)
        {
            var schedules = await _scheduleService.GetAllBySkinTherapistId(skintherapistId);
            if(schedules == null)
            {
                return NotFound("Cannot find the schedule");
            }
            return Ok(schedules);
        }
        // Show all schedules that execute this service
        [HttpGet("/search-by-service/{serviceId}")]
        public async Task<IActionResult> GetSchedulesByServiceId(int serviceId)
        {
            var schedules = await _scheduleService.GetAllByServiceId(serviceId);
            if (schedules == null)
            {
                return NotFound("Cannot find the schedule");
            }
            return Ok(schedules);
        }

        [HttpPut("updateSkintherapistId/{scheduleId}")]
        public async Task<IActionResult> UpdateSkinTherapistID(int scheduleId, [FromBody] int skinTherapistId)
        {
            var result = await _scheduleService.UpdateSkintherapistIDAsync(scheduleId, skinTherapistId);
            if (result)
            {
                return Ok("Skin therapist updated successfully");
            }
            return BadRequest("Failed to update skin therapist");
        }

        [HttpPut("updateSlotId/{scheduleId}")]
        public async Task<IActionResult> UpdateSlotID(int scheduleId, [FromBody] int slotId)
        {
            var result = await _scheduleService.UpdateSlotIDAsync(scheduleId, slotId);
            if (result)
            {
                return Ok("Slot updated successfully");
            }
            return BadRequest("Failed to update slot");
        }
    }
}
