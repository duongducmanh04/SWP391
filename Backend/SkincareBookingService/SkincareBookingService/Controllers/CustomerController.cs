using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
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

        [HttpPost("createCustomer")]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerDTO customer)
        {
            var result = await _customerService.CreateCustomerAsync(customer);
            if (result != null)
            {
                return Ok("Customer created successfully");
            }
            return BadRequest("Failed to create customer");
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

        [HttpPut("updateCustomerName/{customerId}")]
        public async Task<IActionResult> UpdateCustomerName(int customerId, [FromBody] string name)
        {
            var result = await _customerService.UpdateCustomerNameAsync(customerId, name);
            if (result)
            {
                return Ok(new { message = "Customer name updated successfully." });
            }
            return BadRequest(new { message = "Failed to update customer name." });
        }

        [HttpPut("updateCustomerEmail/{customerId}")]
        public async Task<IActionResult> UpdateCustomerEmail(int customerId, [FromBody] string email)
        {
            var result = await _customerService.UpdateCustomerEmailAsync(customerId, email);
            if (result)
            {
                return Ok(new { message = "Customer email updated successfully." });
            }
            return BadRequest(new { message = "Failed to update customer email." });
        }

        [HttpPut("updateCustomerPhoneNumber/{customerId}")]
        public async Task<IActionResult> UpdateCustomerPhoneNumber(int customerId, [FromBody] string phoneNumber)
        {
            var result = await _customerService.UpdateCustomerPhoneNumberAsync(customerId, phoneNumber);
            if (result)
            {
                return Ok(new { message = "Customer phone number updated successfully." });
            }
            return BadRequest(new { message = "Failed to update customer phone number." });
        }

        [HttpPut("updateCustomerSkintype/{customerId}")]
        public async Task<IActionResult> UpdateCustomerSkintype(int customerId, [FromBody] int skintypeId)
        {
            var result = await _customerService.UpdateCustomerSkintypeAsync(customerId, skintypeId);
            if (result)
            {
                return Ok(new { message = "Customer skintype updated successfully." });
            }
            return BadRequest(new { message = "Failed to update customer skintype." });
        }

        [HttpPut("updateCustomer/{customerId}")]
        public async Task<IActionResult> UpdateCustomer(int customerId, [FromBody] CustomerDTO customer)
        {
            var result = await _customerService.UpdateCustomerAsync(customerId, customer.Name, customer.Email, customer.PhoneNumber, (int)customer.SkintypeId);
            if (result)
            {
                return Ok(new { message = "Customer updated successfully." });
            }
            return BadRequest(new { message = "Failed to update customer." });
        }
    }
}
