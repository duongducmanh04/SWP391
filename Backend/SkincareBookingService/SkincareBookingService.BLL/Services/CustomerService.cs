using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.DTOs.BookingDTOss;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IGenericRepository<Customer> _customerRepository;
        private readonly IGenericRepository<Booking> _bookingRepository;

        public CustomerService(IGenericRepository<Customer> customerRepository, IGenericRepository<Booking> bookingRepository)
        {
            _customerRepository = customerRepository;
            _bookingRepository = bookingRepository;
        }

        public async Task<CustomerDTO> CreateCustomerAsync(CustomerDTO customer)
        {
            var customerDTO = new CustomerDTO();

            var newCustomer = new Customer
            {
                Name = customer.Name,
                SkintypeId = customer.SkintypeId,
                AccountId = customer.AccountId,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                Image = customer.Image,
            };

            await _customerRepository.AddAsync(newCustomer);
            await _customerRepository.SaveChangesAsync();

            var createdCustomer = await _customerRepository.FirstOrDefaultAsync(c => c.Email == newCustomer.Email);

            if (createdCustomer == null)
            {
                return null;
            }
            return new CustomerDTO
            {
                CustomerId = createdCustomer.CustomerId,
                Name = createdCustomer.Name,
                SkintypeId = createdCustomer.SkintypeId,
                AccountId = createdCustomer.AccountId,
                Email = createdCustomer.Email,
                PhoneNumber = createdCustomer.PhoneNumber,
                Image = createdCustomer.Image,
            };
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

        public async Task<bool> UpdateCustomerAsync(int customerId, string name, string email, string phoneNumber, int skintypeId)
        {
            var customer = await _customerRepository.FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (customer == null)
            {
                return false;
            }

            customer.Name = name;
            customer.Email = email;
            customer.PhoneNumber = phoneNumber;
            customer.SkintypeId = skintypeId;

            await _customerRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCustomerEmailAsync(int customerId, string email)
        {
            var customer = await _customerRepository.FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (customer == null)
            {
                return false;
            }

            customer.Email = email;
            await _customerRepository.SaveChangesAsync();
            return true;

        }

        public async Task<bool> UpdateCustomerNameAsync(int customerId, string name)
        {
            var customer = await _customerRepository.FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (customer == null)
            {
                return false;
            }

            customer.Name = name;
            await _customerRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCustomerPhoneNumberAsync(int customerId, string phoneNumber)
        {
            var customer = await _customerRepository.FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (customer == null)
            {
                return false;
            }

            customer.PhoneNumber = phoneNumber;
            await _customerRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCustomerSkintypeAsync(int customerId, int skintypeId)
        {
            var customer = await _customerRepository.FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (customer == null)
            {
                return false;
            }

            customer.SkintypeId = skintypeId;
            await _customerRepository.SaveChangesAsync();
            return true;
        }
    }
}
