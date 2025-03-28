using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IRatingService
    {
        Task<IEnumerable<GetRatingDto>> GetRatingsAsync();
        Task<GetRatingDto> GetRatingByIdAsync(int id);
        Task<IEnumerable<GetRatingDto>> GetRatingsByServiceIdAsync(int serviceId);
        Task<IEnumerable<GetRatingDto>> GetRatingsByCustomerIdAsync(int customerId);
        Task<GetRatingDto> CreateRatingAsync(PostRatingDto dto);
        Task<bool> UpdateRatingAsync(int id, PutRatingDto dto);
        Task<bool> DeleteRatingAsync(int id);
        Task<bool> SumRatingByServiceId(int serviceId);
        Task<bool> SumAllServiceAverageStar();
    }
}
