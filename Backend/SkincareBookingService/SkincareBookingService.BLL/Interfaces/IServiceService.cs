using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IServiceService
    {
        Task<ServiceDTO> CreateServiceAsync(ServiceDTO serviceDTO);
        Task<List<ServiceDTO>> GetServicesAsync();
        Task<ServiceDTO> GetServiceByIdAsync(int serviceId);

        Task<List<ServiceDTO>> GetServiceBySkintherapistIdAsync(int skintherapistId);

        Task<bool> UpdateServiceNameAsync(int serviceId, string name);

        Task<bool> UpdateServiceDescriptionAsync(int serviceId, string description);

        Task<bool> UpdateServicePriceAsync(int serviceId, decimal price);

        Task<bool> UpdateServiceImageAsync(int serviceId, string image);

        Task<bool> UpdateServiceDurationAsync(int serviceId, int duration);

        Task<bool> UpdateServiceProcedureDescriptionAsync(int serviceId, string procedureDescription);

        Task<bool> UpdateServiceAsync(int serviceId, ServiceDTO serviceDTO);

        Task<bool> DeleteServiceAsync(int serviceId);

    }
}
