using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.DTOs.BookingDTOss;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class SkintypeServiceService : ISkintypeServiceService
    {
        private readonly IGenericRepository<DAL.Entities.SkintypeService> _skintypeServiceRepository;

        public SkintypeServiceService(IGenericRepository<DAL.Entities.SkintypeService> skintypeServiceRepository)
        {
            _skintypeServiceRepository = skintypeServiceRepository;
        }

        public async Task<SkintypeServiceDTO> AddSkintypeServiceAsync(SkintypeServiceDTO skintypeServiceDTO)
        {
            var skintypeService = new DAL.Entities.SkintypeService
            {
                SkintypeId = skintypeServiceDTO.SkintypeId,
                ServiceId = skintypeServiceDTO.ServiceId
            };

            await _skintypeServiceRepository.AddAsync(skintypeService);
            await _skintypeServiceRepository.SaveChangesAsync();
            return skintypeServiceDTO;
        }

        public async Task<SkintypeServiceDTO> GetSkintypeServiceByIdAsync(int id)
        {
            var skintypeService = await _skintypeServiceRepository.GetByIdAsync(id);

            if (skintypeService == null)
            {
                return null;
            }

            return new SkintypeServiceDTO
            {
                SkintypeServiceId = skintypeService.SkintypeServiceId,
                SkintypeId = skintypeService.SkintypeId,
                ServiceId = skintypeService.ServiceId
            };
        }

        public async Task<List<SkintypeServiceDTO>> GetSkintypeServiceByServiceIdAsync(int serviceId)
        {
           var skintypeServices = await _skintypeServiceRepository.Query()
                .Where(b => b.ServiceId == serviceId)
                .ToListAsync();
            if (skintypeServices == null || !skintypeServices.Any())
            {
                return null;
            }
            return skintypeServices.Select(s => new SkintypeServiceDTO
            {
                SkintypeServiceId = s.SkintypeServiceId,
                SkintypeId = s.SkintypeId,
                ServiceId = s.ServiceId
            }).ToList();
        }

        public async Task<List<SkintypeServiceDTO>> GetSkintypeServiceBySkintypeIdAsync(int skintypeId)
        {
            var skintypeServices = await _skintypeServiceRepository.Query()
                .Where(b => b.SkintypeId == skintypeId)
                .ToListAsync();

            if (skintypeServices == null || !skintypeServices.Any())
            {
                return null;
            }

            return skintypeServices.Select(s => new SkintypeServiceDTO
            {
                SkintypeServiceId = s.SkintypeServiceId,
                SkintypeId = s.SkintypeId,
                ServiceId = s.ServiceId
            }).ToList();
        }

        public async Task<List<SkintypeServiceDTO>> GetSkintypeServicesAsync()
        {
            var skintypeServices = await _skintypeServiceRepository.GetAllAsync();

            if (skintypeServices == null)
            {
                return null;
            }

            return skintypeServices.Select(s => new SkintypeServiceDTO
            {
                SkintypeServiceId = s.SkintypeServiceId,
                SkintypeId = s.SkintypeId,
                ServiceId = s.ServiceId
            }).ToList();
        }
    }
}
