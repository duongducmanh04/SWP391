﻿using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/slot")]
    [ApiController]
    public class SlotController : ControllerBase
    {
        private readonly ISlotService _slotService;

        public SlotController(ISlotService slotService)
        {
            _slotService = slotService;
        }

        [HttpGet("getAllSlots")]
        public async Task<IActionResult> GetAllSlots()
        {
            var slots = await _slotService.GetAllSlotsAsync();
            if (slots == null || slots.Count == 0)
            {
                return NotFound("No slots found");
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
    }
}
