using Microsoft.EntityFrameworkCore;
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

        public async Task<bool> UpdateServiceNameAsync(int serviceId, string name)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null) return false;

            service.Name = name;
            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateServiceDescriptionAsync(int serviceId, string description)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null) return false;

            service.Description = description;
            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateServicePriceAsync(int serviceId, decimal price)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null) return false;

            service.Price = price;
            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateServiceImageAsync(int serviceId, string image)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null) return false;

            service.Image = image;
            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateServiceDurationAsync(int serviceId, int duration)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null) return false;

            service.Duration = duration;
            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateServiceProcedureDescriptionAsync(int serviceId, string procedureDescription)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null) return false;

            service.ProcedureDescription = procedureDescription;
            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();

            return true;
        }

        public async Task<List<ServiceDTO>> GetServiceBySkintherapistIdAsync(int skintherapistId)
        {
            var skintherapistServices = await _serviceRepository.Query()
                .Where(b => b.SkinTherapistServices.Any(sts => sts.SkintherapistId == skintherapistId))
                .ToListAsync();

            if (skintherapistServices == null || !skintherapistServices.Any())
            {
                return null;
            }

            return skintherapistServices.Select(s => new ServiceDTO
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

        public async Task<ServiceDTO> CreateServiceAsync(ServiceDTO serviceDTO)
        {
            var service = new Service
            {
                Name = serviceDTO.Name,
                Description = serviceDTO.Description,
                Price = serviceDTO.Price,
                Duration = serviceDTO.Duration,
                ProcedureDescription = serviceDTO.ProcedureDescription,
                Image = serviceDTO.Image
            };

            await _serviceRepository.AddAsync(service);
            await _serviceRepository.SaveChangesAsync();

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

        public async Task<bool> DeleteServiceAsync(int serviceId)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);

            if (service == null) return false;

            await _serviceRepository.DeleteAsync(service);
            await _serviceRepository.SaveChangesAsync();

            return true;
        }
    }
}
