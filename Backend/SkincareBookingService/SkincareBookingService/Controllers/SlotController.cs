using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/slot")]
    [ApiController]
    public class SlotController : ControllerBase
    {
        private readonly ISlotService _slotService;
        private readonly IScheduleService _scheduleService;
        public SlotController(ISlotService slotService, IScheduleService scheduleService)
        {
            _slotService = slotService;
            _scheduleService = scheduleService;
        }

        [HttpPost("createSlot")]
        public async Task<IActionResult> CreateSlot([FromBody] SlotDTO slot)
        {
            var result = await _slotService.CreateSlotAsync(slot);
            if (result)
            {
                return Ok("Slot created successfully");
            }
            return BadRequest("Failed to create slot");
        }

        [HttpGet("getAllSlots")]
        public async Task<IActionResult> GetAllSlots()
        {
            var slots = await _slotService.GetAllSlotsAsync();
            if (slots == null || slots.Count == 0)
            {
                return NotFound("No slots found");
            }
            foreach (var slot in slots)
            {
                slot.Date = await _scheduleService.GetDateBySlotId(slot.SlotId);
            }
            return Ok(slots);
        }

        [HttpGet("getSlotById/{id}")]
        public async Task<IActionResult> GetSlotById(int id)
        {
            var slot = await _slotService.GetSlotByIdAsync(id);
            if (slot == null)
            {
                return NotFound("Slot not found");
            }

            slot.Date = await _scheduleService.GetDateBySlotId(slot.SlotId);
            return Ok(slot);
        }

        [HttpGet("getAvailableSlots")]
        public async Task<IActionResult> GetAvailableSlots()
        {
            var slots = await _slotService.GetActiveSlotsAsync();
            if (slots == null || slots.Count == 0)
            {
                return NotFound("No available slots found");
            }
            foreach (var slot in slots)
            {
                slot.Date = await _scheduleService.GetDateBySlotId(slot.SlotId);
            }
            return Ok(slots);
        }

        [HttpGet("getBookedSlots")]
        public async Task<IActionResult> GetBookedSlots()
        {
            var slots = await _slotService.GetBookedSlotsAsync();
            if (slots == null || slots.Count == 0)
            {
                return NotFound("No booked slots found");
            }
            foreach (var slot in slots)
            {
                slot.Date = await _scheduleService.GetDateBySlotId(slot.SlotId);
            }
            return Ok(slots);
        }

        [HttpPut("updateSlotToActive/{id}")]
        public async Task<IActionResult> UpdateSlotToActive(int id)
        {
            var result = await _slotService.UpdateSlotToActiveAsync(id);
            if (!result)
            {
                return NotFound("Slot not found");
            }
            return Ok("Slot updated successfully");
        }

        [HttpPut("updateSlotToBooked/{id}")]
        public async Task<IActionResult> UpdateSlotToBooked(int id)
        {
            var result = await _slotService.UpdateSlotToBookedAsync(id);
            if (!result)
            {
                return NotFound("Slot not found");
            }
            return Ok("Slot updated successfully");
        }

        [HttpPut("updateSlotTime/{id}")]
        public async Task<IActionResult> UpdateSlotTime(int id, [FromBody] string time)
        {
            var result = await _slotService.UpdateSlotTimeAsync(id, time);
            if (!result)
            {
                return NotFound("Slot not found");
            }
            return Ok("Slot updated successfully");
        }

        [HttpPut("updateSlotBookingId/{slotId}")]
        public async Task<IActionResult> UpdateSlotBookingId(int slotId, [FromBody] int bookingId)
        {
            var result = await _slotService.UpdateSlotBookingIdAsync(slotId, bookingId);
            if (!result)
            {
                return NotFound("Slot not found");
            }
            return Ok("Slot updated successfully");
        }
    }
}
