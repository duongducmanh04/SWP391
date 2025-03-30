using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class SkintherapistServiceService : ISkintherapistServiceService
    {
        private readonly IGenericRepository<SkinTherapistService> _skintherapistServiceRepository;
        private readonly IGenericRepository<SkinTherapist> _skintherapistRepository;

        public SkintherapistServiceService(IGenericRepository<SkinTherapistService> skintherapistServiceRepository,
            IGenericRepository<SkinTherapist> skintherapistRepository)
        {
            _skintherapistServiceRepository = skintherapistServiceRepository;
            _skintherapistRepository = skintherapistRepository;
        }

        public async Task<List<SkintherapistServiceDTO>> GetAll()
        {
            var skintherapistServices = await _skintherapistServiceRepository.GetAllAsync();
            if (skintherapistServices == null)
            {
                return null;
            }

            var skintherapist = await _skintherapistRepository.GetAllAsync();
            if (skintherapist == null)
            {
                return null;
            }

            var skintherapistServiceDTOs = skintherapistServices.Select(s => new SkintherapistServiceDTO
            {
                SkintherapistserviceId = s.SkintherapistserviceId,
                Name = skintherapist.FirstOrDefault(st => st.SkintherapistId == s.SkintherapistId).Name,
                Speciality = skintherapist.FirstOrDefault(st => st.SkintherapistId == s.SkintherapistId).Speciality,
                Email = skintherapist.FirstOrDefault(st => st.SkintherapistId == s.SkintherapistId).Email,
                Experience = skintherapist.FirstOrDefault(st => st.SkintherapistId == s.SkintherapistId).Experience,
                SkintherapistId = s.SkintherapistId,
                ServiceId = s.ServiceId
            }).ToList();

            return skintherapistServiceDTOs;
        }

        public async Task<List<int>> GetServicesBySkintherapistIdAsync(int skintherapistId)
        {
            var skintherapistServices = await _skintherapistServiceRepository.Query()
                .Where(sts => sts.SkintherapistId == skintherapistId)
                .Select(sts => sts.ServiceId)
                .ToListAsync();

            if (skintherapistServices == null)
            {
                return null;
            }

            return skintherapistServices.Cast<int>().ToList();
        }
    }
}
