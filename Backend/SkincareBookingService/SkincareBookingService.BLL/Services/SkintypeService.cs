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

        public async Task<SkintypeDTO> GetSkintypeByIdAsync(int skintypeId)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);
            if (skintype == null)
            {
                return null;
            }

            return new SkintypeDTO
            {
                SkintypeId = skintype.SkintypeId,
                SkintypeName = skintype.SkintypeName,
                Description = skintype.Description,
                Image = skintype.Image,
                Status = skintype.Status,
                Pros = skintype.Pros,
                Cons = skintype.Cons,
                SkincareGuide = skintype.SkincareGuide,
                Introduction = skintype.Introduction
            };
        }

        public async Task<List<SkintypeDTO>> GetSkintypesAsync()
        {
            var skintypes = await _skintypeRepository.GetAllAsync();
            return skintypes.Select(s => new SkintypeDTO
            {
                SkintypeId = s.SkintypeId,
                SkintypeName = s.SkintypeName,
                Description = s.Description,
                Image = s.Image,
                Status = s.Status,
                Pros = s.Pros,
                Cons = s.Cons,
                SkincareGuide = s.SkincareGuide,
                Introduction = s.Introduction
            }).ToList();
        }
    }
}
