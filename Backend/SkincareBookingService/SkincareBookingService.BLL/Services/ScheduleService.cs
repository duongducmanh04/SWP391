using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
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
        

        public ScheduleService(IGenericRepository<Schedule> scheduleRepository, IGenericRepository<SkinTherapistService> skinTherapistServiceRepository)
        {
            _scheduleRepository = scheduleRepository;
            _skinTherapistServiceRepository = skinTherapistServiceRepository;
            
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
                scheduleDTO.Date = schedule.Date;
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
    }
}
