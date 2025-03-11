using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/service")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;
        public ServiceController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpPost("createService")]
        public async Task<IActionResult> CreateService([FromBody] ServiceDTO serviceDTO)
        {
            var service = await _serviceService.CreateServiceAsync(serviceDTO);
            return Ok(service);
        }

        [HttpGet("getAllServices")]
        public async Task<IActionResult> GetServices()
        {
            var services = await _serviceService.GetServicesAsync();
            if (services == null || services.Count == 0)
            {
                return NotFound("No services found");
            }
            return Ok(services);
        }
        [HttpGet("getServiceById/{serviceId}")]
        public async Task<IActionResult> GetServiceById(int serviceId)
        {
            var service = await _serviceService.GetServiceByIdAsync(serviceId);
            if (service == null)
            {
                return NotFound("Service not found");
            }
            return Ok(service);
        }

        [HttpGet("getServiceBySkintherapistId/{skintherapistId}")]
        public async Task<IActionResult> GetServiceBySkintherapistId(int skintherapistId)
        {
            var service = await _serviceService.GetServiceBySkintherapistIdAsync(skintherapistId);
            if (service == null)
            {
                return NotFound("Service not found");
            }
            return Ok(service);
        }

        [HttpPut("updateServiceName/{serviceId}")]
        public async Task<IActionResult> UpdateServiceName(int serviceId, [FromBody] string name)
        {
            var result = await _serviceService.UpdateServiceNameAsync(serviceId, name);
            if (result)
            {
                return Ok(new { message = "Service name updated successfully." });
            }
            return BadRequest(new { message = "Failed to update service name." });
        }

        [HttpPut("updateServiceDescription/{serviceId}")]
        public async Task<IActionResult> UpdateServiceDescription(int serviceId, [FromBody] string description)
        {
            var result = await _serviceService.UpdateServiceDescriptionAsync(serviceId, description);
            if (result)
            {
                return Ok(new { message = "Service description updated successfully." });
            }
            return BadRequest(new { message = "Failed to update service description." });
        }

        [HttpPut("updateServicePrice/{serviceId}")]
        public async Task<IActionResult> UpdateServicePrice(int serviceId, [FromBody] decimal price)
        {
            var result = await _serviceService.UpdateServicePriceAsync(serviceId, price);
            if (result)
            {
                return Ok(new { message = "Service price updated successfully." });
            }
            return BadRequest(new { message = "Failed to update service price." });
        }

        [HttpPut("updateServiceImage/{serviceId}")]
        public async Task<IActionResult> UpdateServiceImage(int serviceId, [FromBody] string image)
        {
            var result = await _serviceService.UpdateServiceImageAsync(serviceId, image);
            if (result)
            {
                return Ok(new { message = "Service image updated successfully." });
            }
            return BadRequest(new { message = "Failed to update service image." });
        }

        [HttpPut("updateServiceDuration/{serviceId}")]
        public async Task<IActionResult> UpdateServiceDuration(int serviceId, [FromBody] int duration)
        {
            var result = await _serviceService.UpdateServiceDurationAsync(serviceId, duration);
            if (result)
            {
                return Ok(new { message = "Service duration updated successfully." });
            }
            return BadRequest(new { message = "Failed to update service duration." });
        }

        [HttpPut("updateServiceProcedureDescription/{serviceId}")]
        public async Task<IActionResult> UpdateServiceProcedureDescription(int serviceId, [FromBody] string procedureDescription)
        {
            var result = await _serviceService.UpdateServiceProcedureDescriptionAsync(serviceId, procedureDescription);
            if (result)
            {
                return Ok(new { message = "Service procedure description updated successfully." });
            }
            return BadRequest(new { message = "Failed to update service procedure description." });
        }

        [HttpDelete("deleteService/{serviceId}")]
        public async Task<IActionResult> DeleteService(int serviceId)
        {
            var result = await _serviceService.DeleteServiceAsync(serviceId);
            if (result)
            {
                return Ok(new { message = "Service deleted successfully." });
            }
            return BadRequest(new { message = "Failed to delete service." });
        }
    }
}
