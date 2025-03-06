using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("getAllCustomers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            if (customers == null || customers.Count == 0)
            {
                return NotFound("No customers found");
            }
            return Ok(customers);
        }

        [HttpGet("getCustomerById/{customerId}")]
        public async Task<IActionResult> GetCustomerById(int customerId)
        {
            var customer = await _customerService.GetCustomerByIdAsync(customerId);
            if (customerId <= 0)
            {
                return NotFound("CustomerId should be >0");
            }
            else if (customer == null)
            {
                return NotFound("No customer found with that id");
            }
            return Ok(customer);
        }

        [HttpGet("getCustomerBookingHistory/{customerId}")]
        public async Task<IActionResult> GetCustomerBookingHistory(int customerId)
        {
            var bookings = await _customerService.GetCustomerBookingHistoryAsync(customerId);
            if (bookings == null || bookings.Count == 0)
            {
                return NotFound("No bookings found");
            }
            return Ok(bookings);
        }
    }
}
