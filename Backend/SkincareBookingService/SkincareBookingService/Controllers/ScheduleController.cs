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
    }
}
