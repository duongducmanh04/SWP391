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

        [HttpGet("{serviceId}/{skintherapistId?}")]
        public async Task<IActionResult> GetSchedule(int serviceId, int? skintherapistId)
        {
            var schedules = await _scheduleService.GetAllByServiceIdAndSkinTherapistId(serviceId, skintherapistId);
            if(schedules == null)
            {
                return NotFound("Cannot find the schedule");
            }
            return Ok(schedules);
        }
    }
}
