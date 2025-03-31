using Microsoft.EntityFrameworkCore;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.BLL.Constants;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IGenericRepository<Service> _serviceRepository;
        private readonly IGenericRepository<Rating> _ratingRepository;

        public ServiceService(IGenericRepository<Service> serviceRepository, IGenericRepository<Rating> ratingRepository)
        {
            _serviceRepository = serviceRepository;
            _ratingRepository = ratingRepository;
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
                AverageStars = s.AverageStars,
                ProcedureDescription = s.ProcedureDescription,
                Image = s.Image,
                Status = s.Status,
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
                AverageStars = service.AverageStars,
                ProcedureDescription = service.ProcedureDescription,
                Image = service.Image,
                Status = service.Status
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
                AverageStars = s.AverageStars,
                ProcedureDescription = s.ProcedureDescription,
                Image = s.Image,
                Status = s.Status
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
                Image = serviceDTO.Image,
                AverageStars = 0,
                Status = ServiceStatus.Active.ToString()
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
                Image = service.Image,
                AverageStars = service.AverageStars,
                Status = service.Status
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

        public async Task<bool> UpdateServiceAsync(int serviceId, ServiceDTO serviceDTO)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);

            if (service == null) return false;

            service.Name = serviceDTO.Name;
            service.Description = serviceDTO.Description;
            service.Price = serviceDTO.Price;
            service.Duration = serviceDTO.Duration;
            service.ProcedureDescription = serviceDTO.ProcedureDescription;
            service.Image = serviceDTO.Image;
            service.Status = serviceDTO.Status;

            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();

            return true;
        }

        private async Task<ServiceDTO> MapToDto(Service service)
        {
            return new ServiceDTO
            {
                ServiceId = service.ServiceId,
                Name = service.Name,
                Description = service.Description,
                Price = service.Price,
                Duration = service.Duration,
                ProcedureDescription = service.ProcedureDescription,
                Image = service.Image,
                AverageStars = service.AverageStars,
                Status = service.Status
            };
        }
        public async Task<IEnumerable<ServiceDTO>> GetTopRatingService()
        {
            var services = await _serviceRepository.Query()
                .OrderByDescending(s => s.AverageStars)
                .ToListAsync();
            IEnumerable<ServiceDTO> result = new List<ServiceDTO>();
            foreach (var service in services)
            {
                result = result.Append(await MapToDto(service));
            }

            return result;
        }

        public async Task<bool> UpdateServiceStatusAsync(int serviceId)
        {
            var service = await _serviceRepository.GetByIdAsync(serviceId);
            if (service == null) return false;

            service.Status = service.Status == ServiceStatus.Active.ToString() ? ServiceStatus.Inactive.ToString() : ServiceStatus.Active.ToString();
            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();

            return true;
        }

        public async Task<List<ServiceDTO>> GetActiveServicesAsync()
        {
            var service = await _serviceRepository.Query()
                .Where(s => s.Status == ServiceStatus.Active.ToString())
                .ToListAsync();

            return service.Select(s => new ServiceDTO
            {
                ServiceId = s.ServiceId,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                Duration = s.Duration,
                AverageStars = s.AverageStars,
                ProcedureDescription = s.ProcedureDescription,
                Image = s.Image,
                Status = s.Status
            }).ToList();
        }
    }
}
