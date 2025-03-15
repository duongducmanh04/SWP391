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

        public async Task<SkintypeDTO> CreateSkintypeAsync(SkintypeDTO skintypeDTO)
        {
            var skintype = new SkinType
            {
                SkintypeName = skintypeDTO.SkintypeName,
                Description = skintypeDTO.Description,
                Image = skintypeDTO.Image,
                Status = skintypeDTO.Status,
                Pros = skintypeDTO.Pros,
                Cons = skintypeDTO.Cons,
                SkincareGuide = skintypeDTO.SkincareGuide,
                Introduction = skintypeDTO.Introduction
            };

            await _skintypeRepository.AddAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();

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

        public async Task<bool> DeleteSkintypeAsync(int skintypeId)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);

            if (skintype == null) return false;

            await _skintypeRepository.DeleteAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
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

        public async Task<bool> UpdateSkintypeAsync(SkintypeDTO skintypeDTO)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeDTO.SkintypeId);

            if (skintype == null) return false;

            skintype.SkintypeName = skintypeDTO.SkintypeName;
            skintype.Description = skintypeDTO.Description;
            skintype.Image = skintypeDTO.Image;
            skintype.Status = skintypeDTO.Status;
            skintype.Pros = skintypeDTO.Pros;
            skintype.Cons = skintypeDTO.Cons;
            skintype.SkincareGuide = skintypeDTO.SkincareGuide;
            skintype.Introduction = skintypeDTO.Introduction;

            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSkintypeConsAsync(int skintypeId, string cons)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);

            if (skintype == null) return false;

            skintype.Cons = cons;
            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSkintypeDescriptionAsync(int skintypeId, string description)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);

            if (skintype == null) return false;

            skintype.Description = description;
            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSkintypeImageAsync(int skintypeId, string image)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(1);

            if (skintype == null) return false;

            skintype.Image = image;
            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSkintypeIntroductionAsync(int skintypeId, string introduction)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);

            if (skintype == null) return false;

            skintype.Introduction = introduction;
            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSkintypeNameAsync(int skintypeId, string skintypeName)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);

            if (skintype == null) return false;

            skintype.SkintypeName = skintypeName;
            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSkintypeProsAsync(int skintypeId, string pros)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);

            if (skintype == null) return false;

            skintype.Pros = pros;
            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSkintypeSkincareGuideAsync(int skintypeId, string skincareGuide)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);

            if (skintype == null) return false;

            skintype.SkincareGuide = skincareGuide;
            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSkintypeStatusAsync(int skintypeId, string status)
        {
            var skintype = await _skintypeRepository.GetByIdAsync(skintypeId);

            if (skintype == null) return false;

            skintype.Status = status;
            await _skintypeRepository.UpdateAsync(skintype);
            await _skintypeRepository.SaveChangesAsync();
            return true;
        }
    }
}
