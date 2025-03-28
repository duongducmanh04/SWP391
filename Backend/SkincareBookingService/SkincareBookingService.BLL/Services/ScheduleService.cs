﻿using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs.ScheduleDTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;
using System.Linq;

namespace SkincareBookingService.BLL.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly IGenericRepository<Schedule> _scheduleRepository;
        private readonly IGenericRepository<SkinTherapistService> _skinTherapistServiceRepository;
        private readonly IGenericRepository<Slot> _slotRepository;


        public ScheduleService(IGenericRepository<Schedule> scheduleRepository, IGenericRepository<SkinTherapistService> skinTherapistServiceRepository, IGenericRepository<Slot> slotRepository)
        {
            _scheduleRepository = scheduleRepository;
            _skinTherapistServiceRepository = skinTherapistServiceRepository;
            _slotRepository = slotRepository;
        }

        public async Task<List<ScheduleDTO>> GetAllBySkinTherapistId(int skinTherapistId)
        {
            //Get Schedules
            List<Schedule> schedules = await _scheduleRepository
                .Query()
                .Where(s => s.SkinTherapistId == skinTherapistId)
                .ToListAsync();

            return await MapListScheduleToScheduleDTO(schedules);
        }
        public async Task<List<List<ScheduleDTO>>> GetAllByServiceId(int serviceId)
        {
            //Get all skin therapist that can do this service
            List<int?> skinTherapistIds = await _skinTherapistServiceRepository
                .Query()
                .Where(sts => sts.ServiceId == serviceId)
                .Select(sts => sts.SkintherapistId)
                .ToListAsync();
            //Get Schedules
            List<List<ScheduleDTO>> listScheduleDTOs = new();
            foreach(int skinTherapistId in skinTherapistIds)
            {
                List<ScheduleDTO> schedule = await GetAllBySkinTherapistId(skinTherapistId);
                listScheduleDTOs.Add(schedule);
            }
            
            return listScheduleDTOs;
        }
        private async Task<ScheduleDTO> MapScheduleToScheduleDTO(Schedule schedule)
        {
            ScheduleDTO scheduleDTO = new ScheduleDTO();
            if (schedule != null)
            {
                scheduleDTO.ScheduleId = schedule.ScheduleId;
                scheduleDTO.SkinTherapistId = schedule.SkinTherapistId;
                scheduleDTO.SlotId = schedule.SlotId;
                scheduleDTO.Date = (DateTime)schedule.Date;
                scheduleDTO.SkinTherapist = schedule.SkinTherapist;
                scheduleDTO.Slot = schedule.Slot;
            }

            return scheduleDTO;
        }
        private async Task<List<ScheduleDTO>> MapListScheduleToScheduleDTO(List<Schedule> schedules)
        {
            List<ScheduleDTO> scheduleDTOs = new List<ScheduleDTO>();
            foreach (Schedule schedule in schedules)
            {
                if (schedule != null)
                {
                    scheduleDTOs.Add(await MapScheduleToScheduleDTO(schedule));
                }
            }

            return scheduleDTOs;
        }

        public async Task<ScheduleDTO> GetScheduleById(int id)
        {
            List<Schedule> schedules = await _scheduleRepository
                .Query()
                .Where(s => s.ScheduleId == id)
                .ToListAsync();

            return await MapScheduleToScheduleDTO(schedules.FirstOrDefault());
        }

        public async Task<bool> UpdateSkintherapistIDAsync(int scheduleId, int skinTherapistId)
        {
            var schedule = await _scheduleRepository.GetByIdAsync(scheduleId);
            if (schedule == null) return false;

            schedule.SkinTherapistId = skinTherapistId;
            await _scheduleRepository.UpdateAsync(schedule);
            await _scheduleRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSlotIDAsync(int scheduleId, int slotId)
        {
            var schedule = await _scheduleRepository.GetByIdAsync(scheduleId);
            if (schedule == null) return false;
            schedule.SlotId = slotId;
            await _scheduleRepository.UpdateAsync(schedule);
            await _scheduleRepository.SaveChangesAsync();
            return true;
        }

        public async Task<DateTime> GetDateBySlotId(int slotId)
        {
            Schedule? schedule = await _scheduleRepository.Query()
                .Where(s => s.SlotId == slotId)
                .FirstOrDefaultAsync();
            if(schedule == null)
            {
                throw new Exception($"Schedule not found for Slot ID: {slotId}");
            }
            return (DateTime)schedule.Date;
        }

        public async Task<ScheduleInputDTO> CreateScheduleAsync(ScheduleInputDTO scheduleInputDTO)
        {
            var schedule = new Schedule
            {
                SkinTherapistId = scheduleInputDTO.SkinTherapistId,
                SlotId = scheduleInputDTO.SlotId,
                Date = scheduleInputDTO.Date
            };

            await _scheduleRepository.AddAsync(schedule);
            await _scheduleRepository.SaveChangesAsync();

            return new ScheduleInputDTO
            {
                ScheduleId = schedule.ScheduleId,
                SkinTherapistId = schedule.SkinTherapistId,
                SlotId = schedule.SlotId,
                Date = (DateTime)schedule.Date
            };
        }

        public async Task<List<ScheduleDTO>> GetAllScheduleAsync()
        {
            var schedules = await _scheduleRepository.GetAllAsync();

            if (schedules == null || !schedules.Any())
            {
                return null;
            }

            return new List<ScheduleDTO>(schedules.Select(s => new ScheduleDTO
            {
                ScheduleId = s.ScheduleId,
                SkinTherapistId = s.SkinTherapistId,
                SlotId = s.SlotId,
                Date = (DateTime)s.Date,
                SkinTherapist = s.SkinTherapist,
                Slot = s.Slot
            }));
        }
    }
}
