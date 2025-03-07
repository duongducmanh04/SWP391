using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IGenericRepository<Service> _serviceRepository;

        public ServiceService(IGenericRepository<Service> serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }

        public async Task<List<ServiceDTO>> GetServicesAsync()
        {
            var services = await _serviceRepository.GetAllAsync();
            return services.Select(s => new ServiceDTO
            {
                ServiceId = s.ServiceId,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                Duration = s.Duration,
                ProcedureDescription = s.ProcedureDescription,
                Image = s.Image
            }).ToList();
        }

        public async Task<ServiceDTO> GetServiceByIdAsync(int serviceId)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null) return null;

            return new ServiceDTO
            {
                ServiceId = service.ServiceId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                Duration = service.Duration,
                ProcedureDescription = service.ProcedureDescription,
                Image = service.Image
            };
        }
    }
}
