using SkincareBookingService.BLL.DTOs;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface ISkintypeService
    {
        Task<SkintypeDTO> CreateSkintypeAsync(SkintypeDTO skintypeDTO);

        Task<bool> UpdateSkintypeNameAsync(int skintypeId, string skintypeName);

        Task<bool> UpdateSkintypeDescriptionAsync(int skintypeId, string description);

        Task<bool> UpdateSkintypeImageAsync(int skintypeId, string image);

        Task<bool> UpdateSkintypeStatusAsync(int skintypeId, string status);

        Task<bool> UpdateSkintypeProsAsync(int skintypeId, string pros);

        Task<bool> UpdateSkintypeConsAsync(int skintypeId, string cons);

        Task<bool> UpdateSkintypeSkincareGuideAsync(int skintypeId, string skincareGuide);

        Task<bool> UpdateSkintypeIntroductionAsync(int skintypeId, string introduction);

        Task<bool >UpdateSkintypeAsync(SkintypeDTO skintypeDTO);

        Task<List<SkintypeDTO>> GetSkintypesAsync();

        Task<SkintypeDTO> GetSkintypeByIdAsync(int skintypeId);

        Task<bool> DeleteSkintypeAsync(int skintypeId);
    }
}
