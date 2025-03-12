using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IRatingService
    {
        Task<IEnumerable<RatingDto>> GetRatingsAsync();
        Task<RatingDto> GetRatingByIdAsync(int id);
        Task<IEnumerable<RatingDto>> GetRatingsByServiceIdAsync(int serviceId);
        Task<IEnumerable<RatingDto>> GetRatingsByCustomerIdAsync(int customerId);
        Task<RatingDto> CreateRatingAsync(PostRatingDto dto);
        Task<bool> UpdateRatingAsync(int id, PutRatingDto dto);
        Task<bool> DeleteRatingAsync(int id);
    }
}
