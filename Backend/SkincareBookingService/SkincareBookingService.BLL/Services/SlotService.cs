﻿using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.Core.Constants;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class SlotService : ISlotService
    {
        private readonly IGenericRepository<Slot> _slotRepository;

        public SlotService(IGenericRepository<Slot> slotRepository)
        {
            _slotRepository = slotRepository;
        }

        public async Task<bool> CreateSlotAsync(SlotDTO slotDto)
        {
            var slot = new Slot
            {
                Status = slotDto.Status,
                Time = slotDto.Time,
                BookingId = slotDto.BookingId,
            };

            await _slotRepository.AddAsync(slot);
            await _slotRepository.SaveChangesAsync();
            return true;
        }

        public async Task<List<SlotDTO>> GetActiveSlotsAsync()
        {
            var slots = await _slotRepository.GetAllAsync();
            return slots.Where(s => s.Status == SlotStatus.Available.ToString()).Select(s => new SlotDTO
            {
                SlotId = s.SlotId,
                Status = s.Status,
                Time = s.Time,
                BookingId = s.BookingId,
            }).ToList();
        }

        public async Task<List<SlotDTO>> GetAllSlotsAsync()
        {
            var slots = await _slotRepository.GetAllAsync();
            return slots.Select(s => new SlotDTO
            {
                SlotId = s.SlotId,
                Status = s.Status,
                Time = s.Time,
                BookingId = s.BookingId
            }).ToList();
        }

        public async Task<List<SlotDTO>> GetBookedSlotsAsync()
        {
            var slots = await _slotRepository.GetAllAsync();
            return slots.Where(s => s.Status == SlotStatus.Booked.ToString()).Select(s => new SlotDTO
            {
                SlotId = s.SlotId,
                Status = s.Status,
                Time = s.Time,
                BookingId = s.BookingId
            }).ToList();
        }

        public async Task<SlotDTO> GetSlotByIdAsync(int id)
        {
            var slot = await _slotRepository.GetByIdAsync(id);
            if (slot == null) return null;
            return new SlotDTO
            {
                SlotId = slot.SlotId,
                Status = slot.Status,
                Time = slot.Time,
                BookingId = slot.BookingId
            };
        }

        public async Task<bool> UpdateSlotBookingIdAsync(int slotId, int bookingId)
        {
            var slot = await _slotRepository.GetByIdAsync(slotId);
            if (slot == null) return false;

            slot.BookingId = bookingId;
            await _slotRepository.UpdateAsync(slot);
            await _slotRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSlotTimeAsync(int id, string time)
        {
            var slot = await _slotRepository.GetByIdAsync(id);
            if (slot == null) return false;
            slot.Time = time;
            await _slotRepository.UpdateAsync(slot);
            await _slotRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSlotToActiveAsync(int id)
        {
            var slot = await _slotRepository.GetByIdAsync(id);
            if (slot == null) return false;

            slot.Status = SlotStatus.Available.ToString();
            await _slotRepository.UpdateAsync(slot);
            await _slotRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSlotToBookedAsync(int id)
        {
            var slot = await _slotRepository.GetByIdAsync(id);
            if (slot == null) return false;

            slot.Status = SlotStatus.Booked.ToString();
            await _slotRepository.UpdateAsync(slot);
            await _slotRepository.SaveChangesAsync();
            return true;
        }
    }
}
