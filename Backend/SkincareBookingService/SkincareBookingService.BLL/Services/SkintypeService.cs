using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class SkintypeService : ISkintypeService
    {
        private readonly IGenericRepository<SkinType> _skintypeRepository;

        public SkintypeService(IGenericRepository<SkinType> genericRepository)
        {
            _skintypeRepository = genericRepository;
        }

        public async Task<List<SkintypeDTO>> GetSkintypesAsync()
        {
            var skintypes = await _skintypeRepository.GetAllAsync();
            return skintypes.Select(s => new SkintypeDTO
            {
                SkintypeId = s.SkintypeId,
                SkintypeName = s.SkintypeName,
                Introduction = s.Introduction,
                Description = s.Description,
                SkincareGuide = s.SkincareGuide,
                Image = s.Image,
                Status = s.Status,
                Pros = s.Pros,
                Cons = s.Cons,
            }).ToList();
        }
    }
}
