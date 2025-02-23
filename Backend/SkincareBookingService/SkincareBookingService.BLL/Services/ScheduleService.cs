using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

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

        public async Task<List<ScheduleDTO>> GetAllByServiceIdAndSkinTherapistId(int serviceId, int? skinTherapistId)
        {
            //assign random skin therapist if skinTherapistId = null
            if (skinTherapistId == null)
            {
                SkinTherapistService? skinTherapistService = await _skinTherapistServiceRepository
                    .Query()
                    .Where(sts => sts.ServiceId == serviceId)
                    .FirstOrDefaultAsync();
                skinTherapistId = skinTherapistService?.ServiceId;
            }
            //Get Schedules
            List<Schedule> schedules = await _scheduleRepository
                .Query()
                .Where(s => s.SkinTherapistId == skinTherapistId)
                .ToListAsync();
            //Transform into scheduleDTO
            List<ScheduleDTO> scheduleDTOs = new List<ScheduleDTO>();
            foreach(Schedule schedule in schedules)
            {
                if(schedule != null)
                {
                    scheduleDTOs.Add(await MapScheduleToScheduleDTO(schedule));
                }
            }

            return scheduleDTOs;
        }

        private async Task<ScheduleDTO> MapScheduleToScheduleDTO(Schedule? schedule)
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
    }
}
