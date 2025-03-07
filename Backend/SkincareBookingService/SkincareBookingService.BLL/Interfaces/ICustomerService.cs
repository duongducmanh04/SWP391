using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.DTOs.BookingDTOss;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ICustomerService
    {
        Task<List<CustomerDTO>> GetAllCustomersAsync();

        Task<CustomerDTO> GetCustomerByIdAsync(int id);

        /*Task<List<BookingDTO>> GetCustomerBookingHistoryAsync(int customerId);*/
    }
}
