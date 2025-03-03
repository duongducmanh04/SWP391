using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IGenericRepository<Customer> _customerRepository;

        public CustomerService(IGenericRepository<Customer> customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<List<CustomerDTO>> GetAllCustomersAsync()
        {
            var customers = await _customerRepository.GetAllAsync();

            return customers.Select(c => new CustomerDTO
            {
                CustomerId = c.CustomerId,
                Name = c.Name,
                SkintypeId = c.SkintypeId,
                AccountId = c.AccountId,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                Image = c.Image,
            }).ToList();
        }

        public async Task<CustomerDTO> GetCustomerByIdAsync(int id)
        {
            var customer = await _customerRepository.FirstOrDefaultAsync(c => c.CustomerId == id);

            if(customer == null)
            {
                return null;
            }

            return new CustomerDTO
            {
                CustomerId = customer.CustomerId,
                Name = customer.Name,
                SkintypeId = customer.SkintypeId,
                AccountId = customer.AccountId,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                Image = customer.Image,
            };
        }
    }
}
