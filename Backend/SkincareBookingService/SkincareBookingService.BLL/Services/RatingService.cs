using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<GetRatingDto>> GetRatingsAsync()
        {
            var ratings = await _ratingRepository.GetAllAsync();
            List<GetRatingDto> ratingDtos = new List<GetRatingDto>();
            foreach (var rating in ratings)
            {
                ratingDtos.Add(await MapToGetDto(rating));
            }

            return ratingDtos;
        }

        public async Task<GetRatingDto> GetRatingByIdAsync(int id)
        {
            if(id <= 0) return null;
            var rating = await _ratingRepository.GetByIdAsync(id);
            return rating == null ? null : await MapToGetDto(rating);
        }

        public async Task<IEnumerable<GetRatingDto>> GetRatingsByServiceIdAsync(int serviceId)
        {
            if (serviceId <= 0) return null;
            var ratings = await _ratingRepository.FindAsync(r => r.ServiceId == serviceId);
            List<GetRatingDto> ratingDtos = new List<GetRatingDto>();
            foreach (var rating in ratings)
            {
                ratingDtos.Add(await MapToGetDto(rating));
            }

            return ratingDtos;
        }

        public async Task<IEnumerable<GetRatingDto>> GetRatingsByCustomerIdAsync(int customerId)
        {
            if (customerId <= 0) return null;
            var ratings = await _ratingRepository.FindAsync(r => r.CustomerId == customerId);
            List<GetRatingDto> ratingDtos = new List<GetRatingDto>();
            foreach (var rating in ratings)
            {
                ratingDtos.Add(await MapToGetDto(rating));
            }

            return ratingDtos;
        }

        public async Task<GetRatingDto> CreateRatingAsync(PostRatingDto dto)
        {
            var existingRating = (await _ratingRepository.FindAsync(r => r.CustomerId == dto.CustomerId && r.ServiceId == dto.ServiceId))
                                 .FirstOrDefault();

            if (existingRating != null)
            {
                existingRating.Stars = dto.Stars;
                existingRating.CreateAt = DateTime.UtcNow;
                existingRating.Feedback = dto.Feedback;
                await _ratingRepository.UpdateAsync(existingRating);
                return await MapToGetDto(existingRating);
            }

            var rating = new Rating
            {
                CustomerId = dto.CustomerId,
                Stars = dto.Stars,
                ServiceId = dto.ServiceId,
                CreateAt = DateTime.UtcNow,
                Feedback = dto.Feedback
            };

            await _ratingRepository.AddAsync(rating);
            return await MapToGetDto(rating);
        }

        public async Task<bool> UpdateRatingAsync(int id, PutRatingDto dto)
        {
            if (id <= 0) return false;
            var rating = await _ratingRepository.GetByIdAsync(id);
            if (rating == null) return false;
            rating.Stars = dto.Stars;
            rating.Feedback = dto.Feedback;
            await _ratingRepository.UpdateAsync(rating);
            return true;
        }

        public async Task<bool> DeleteRatingAsync(int id)
        {
            if (id <= 0) return false;
            var rating = await _ratingRepository.GetByIdAsync(id);
            if (rating == null) return false;
            await _ratingRepository.DeleteAsync(rating);
            return true;
        }

        private async Task<GetRatingDto> MapToGetDto(Rating rating)
        {
            var customer = await _customerRepository.GetByIdAsync(rating.CustomerId);
            var service = await _serviceRepository.GetByIdAsync(rating.ServiceId);

            return new GetRatingDto
            {
                RatingId = rating.RatingId,
                CustomerId = rating.CustomerId,
                CreateAt = rating.CreateAt,
                Stars = rating.Stars,
                ServiceId = rating.ServiceId,
                Feedback = rating.Feedback,
                CustomerName = customer?.Name,
                ServiceName = service?.Name
            };
        }

        public async Task<bool> SumRatingByServiceId(int serviceId)
        {
            if(serviceId <= 0) return false;

            var rating = await _ratingRepository
                .Query()
                .Where(r => r.ServiceId == serviceId)
                .ToListAsync();
            var service = await _serviceRepository.GetByIdAsync(serviceId);

            if (rating == null || rating.Count == 0 || service == null) return false;

            service.AverageStars = rating.Average(r => r.Stars);

            await _serviceRepository.UpdateAsync(service);
            await _serviceRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SumAllServiceAverageStar()
        {
            var ratings = await _ratingRepository.GetAllAsync();
            var services = await _serviceRepository.GetAllAsync();

            if(ratings == null || ratings.Count() == 0 || services == null || services.Count() == 0) return false;

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

            return true;
        }
    }
}
