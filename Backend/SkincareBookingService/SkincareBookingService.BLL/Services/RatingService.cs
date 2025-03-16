using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class RatingService : IRatingService
    {
        private readonly IGenericRepository<Rating> _ratingRepository;
        private readonly IGenericRepository<Service> _serviceRepository;
        private readonly IGenericRepository<Customer> _customerRepository;

        public RatingService(IGenericRepository<Rating> ratingRepository, IGenericRepository<Service> serviceRepository, IGenericRepository<Customer> customerRepository)
        {
            _ratingRepository = ratingRepository;
            _serviceRepository = serviceRepository;
            _customerRepository = customerRepository;
        }

        public async Task<IEnumerable<RatingDto>> GetRatingsAsync()
        {
            var ratings = await _ratingRepository.GetAllAsync();
            List<RatingDto> ratingDtos = new List<RatingDto>();
            foreach (var rating in ratings)
            {
                ratingDtos.Add(await MapToDto(rating));
            }

            return ratingDtos;
        }

        public async Task<RatingDto> GetRatingByIdAsync(int id)
        {
            if(id <= 0) return null;
            var rating = await _ratingRepository.GetByIdAsync(id);
            return rating == null ? null : await MapToDto(rating);
        }

        public async Task<IEnumerable<RatingDto>> GetRatingsByServiceIdAsync(int serviceId)
        {
            if (serviceId <= 0) return null;
            var ratings = await _ratingRepository.FindAsync(r => r.ServiceId == serviceId);
            List<RatingDto> ratingDtos = new List<RatingDto>();
            foreach (var rating in ratings)
            {
                ratingDtos.Add(await MapToDto(rating));
            }

            return ratingDtos;
        }

        public async Task<IEnumerable<RatingDto>> GetRatingsByCustomerIdAsync(int customerId)
        {
            if (customerId <= 0) return null;
            var ratings = await _ratingRepository.FindAsync(r => r.CustomerId == customerId);
            List<RatingDto> ratingDtos = new List<RatingDto>();
            foreach (var rating in ratings)
            {
                ratingDtos.Add(await MapToDto(rating));
            }

            return ratingDtos;
        }

        public async Task<RatingDto> CreateRatingAsync(PostRatingDto dto)
        {
            var existingRating = (await _ratingRepository.FindAsync(r => r.CustomerId == dto.CustomerId && r.ServiceId == dto.ServiceId))
                                 .FirstOrDefault();

            if (existingRating != null)
            {
                existingRating.Stars = dto.Stars;
                existingRating.CreateAt = DateTime.UtcNow;
                await _ratingRepository.UpdateAsync(existingRating);
                return await MapToDto(existingRating);
            }

            var rating = new Rating
            {
                CustomerId = dto.CustomerId,
                Stars = dto.Stars,
                ServiceId = dto.ServiceId,
                CreateAt = DateTime.UtcNow
            };

            await _ratingRepository.AddAsync(rating);
            await SumAllRatings();
            return await MapToDto(rating);
        }

        public async Task<bool> UpdateRatingAsync(int id, PutRatingDto dto)
        {
            if (id <= 0) return false;
            var rating = await _ratingRepository.GetByIdAsync(id);
            if (rating == null) return false;
            rating.Stars = dto.Stars;
            await _ratingRepository.UpdateAsync(rating);
            await SumAllRatings();
            return true;
        }

        public async Task<bool> DeleteRatingAsync(int id)
        {
            if (id <= 0) return false;
            var rating = await _ratingRepository.GetByIdAsync(id);
            if (rating == null) return false;
            await _ratingRepository.DeleteAsync(rating);
            await SumAllRatings();
            return true;
        }

        private async Task<RatingDto> MapToDto(Rating rating)
        {
            var customer = await _customerRepository.GetByIdAsync(rating.CustomerId);
            var service = await _serviceRepository.GetByIdAsync(rating.ServiceId);

            return new RatingDto
            {
                RatingId = rating.RatingId,
                CustomerId = rating.CustomerId,
                CreateAt = rating.CreateAt,
                Stars = rating.Stars,
                ServiceId = rating.ServiceId,
                CustomerName = customer?.Name,
                ServiceName = service?.Name
            };
        }
        private async Task SumAllRatings()
        {
            var ratings = await _ratingRepository.GetAllAsync();
            var services = await _serviceRepository.GetAllAsync();

            foreach (var service in services)
            {
                var serviceRatings = ratings.Where(r => r.ServiceId == service.ServiceId);
                if (serviceRatings.Any())
                {
                    service.AverageStars = serviceRatings.Average(r => r.Stars);
                    await _serviceRepository.UpdateAsync(service);
                    await _serviceRepository.SaveChangesAsync();
                }
            }
        }
    }
}
