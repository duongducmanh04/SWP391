﻿using SkincareBookingService.BLL.DTOs.ScheduleDTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IScheduleService
    {
        Task<ScheduleInputDTO> CreateScheduleAsync(ScheduleInputDTO scheduleInputDTO);

        Task<List<ScheduleDTO>> GetAllScheduleAsync();

        Task<List<ScheduleDTO>> GetAllBySkinTherapistId(int skinTherapistId);
        Task<List<List<ScheduleDTO>>> GetAllByServiceId(int serviceId);
        Task<ScheduleDTO> GetScheduleById(int id);
        Task<bool> UpdateSkintherapistIDAsync (int scheduleId, int skinTherapistId);
        Task<bool> UpdateSlotIDAsync(int scheduleId, int slotId);
        Task<DateTime> GetDateBySlotId(int slotId);
    }
}
