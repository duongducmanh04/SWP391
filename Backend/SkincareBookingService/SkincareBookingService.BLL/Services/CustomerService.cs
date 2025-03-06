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

        public async Task<List<BookingDTO>> GetCustomerBookingHistoryAsync(int customerId)
        {
            // Lấy tất cả các booking có CustomerId tương ứng
            var bookings = await _bookingRepository.FindAsync(b => b.CustomerId == customerId);

            if (bookings == null || !bookings.Any())
            {
                return new List<BookingDTO>();
            }

            // Map sang DTO
            var bookingDTOs = bookings.Select(b => new BookingDTO
            {
                BookingId = b.BookingId,
                CustomerId = b.CustomerId ?? 0,
                Location = b.Location,
                Date = b.Date,
                CreateAt = b.CreateAt,
                Status = b.Status,
                Amount = b.Amount,
                SkintherapistId = b.SkintherapistId ?? 0,
                UpdateAt = b.UpdateAt,
                ServiceName = b.ServiceName,
                CustomerName = b.Customer?.Name ?? null // Lấy tên khách hàng (tránh lỗi null)
            }).ToList();

            return bookingDTOs;
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
