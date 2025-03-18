using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.DTOs.BookingDTOss;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ICustomerService
    {
        Task<List<CustomerDTO>> GetAllCustomersAsync();

        Task<CustomerDTO> GetCustomerByIdAsync(int id);

        Task<CustomerDTO> CreateCustomerAsync(CustomerDTO customer);

        Task<bool> UpdateCustomerNameAsync(int customerId, string name);

        Task<bool> UpdateCustomerEmailAsync(int customerId, string email);

        Task<bool> UpdateCustomerPhoneNumberAsync(int customerId, string phoneNumber);

        Task<bool> UpdateCustomerSkintypeAsync(int customerId, int skintypeId);

        Task<bool> UpdateCustomerAsync(int customerId, CustomerDTO customer);

    }
}
