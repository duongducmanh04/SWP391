using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
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
