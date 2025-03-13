using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    [Route("api/skintype")]
    [ApiController]
    public class SkintypeController : ControllerBase
    {
        private readonly ISkintypeService _skintypeService; 

        public SkintypeController(ISkintypeService skintypeService)
        {
            _skintypeService = skintypeService;
        }

        [HttpPost("createSkintype")]
        public async Task<IActionResult> CreateSkintype([FromBody] SkintypeDTO skintypeDTO)
        {
            var skintype = await _skintypeService.CreateSkintypeAsync(skintypeDTO);
            return Ok(skintype);
        }

        [HttpGet("getAllSkintypes")]
        public async Task<IActionResult> GetSkintypes()
        {
            var skintypes = await _skintypeService.GetSkintypesAsync();
            if (skintypes == null || skintypes.Count == 0)
            {
                return NotFound("No skintypes found");
            }
            return Ok(skintypes);
        }

        [HttpGet("getSkintypeById/{skintypeId}")]
        public async Task<IActionResult> GetSkintypeById(int skintypeId)
        {
            var skintype = await _skintypeService.GetSkintypeByIdAsync(skintypeId);
            if (skintype == null)
            {
                return NotFound("Skintype not found");
            }
            return Ok(skintype);
        }

        [HttpPut("updateSkintypeName/{skintypeId}")]
        public async Task<IActionResult> UpdateSkintypeName(int skintypeId, [FromBody] string skintypeName)
        {
            var result = await _skintypeService.UpdateSkintypeNameAsync(skintypeId, skintypeName);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype name updated");
        }

        [HttpPut("updateSkintypeDescription/{skintypeId}")]
        public async Task<IActionResult> UpdateSkintypeDescription(int skintypeId, [FromBody] string description)
        {
            var result = await _skintypeService.UpdateSkintypeDescriptionAsync(skintypeId, description);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype description updated");
        }

        [HttpPut("updateSkintypeImage/{skintypeId}")]
        public async Task<IActionResult> UpdateSkintypeImage(int skintypeId, [FromBody] string image)
        {
            var result = await _skintypeService.UpdateSkintypeImageAsync(skintypeId, image);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype image updated");
        }

        [HttpPut("updateSkintypeStatus/{skintypeId}")]
        public async Task<IActionResult> UpdateSkintypeStatus(int skintypeId, [FromBody] string status)
        {
            var result = await _skintypeService.UpdateSkintypeStatusAsync(skintypeId, status);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype status updated");
        }

        [HttpPut("updateSkintypePros/{skintypeId}")]
        public async Task<IActionResult> UpdateSkintypePros(int skintypeId, [FromBody] string pros)
        {
            var result = await _skintypeService.UpdateSkintypeProsAsync(skintypeId, pros);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype pros updated");
        }

        [HttpPut("updateSkintypeCons/{skintypeId}")]
        public async Task<IActionResult> UpdateSkintypeCons(int skintypeId, [FromBody] string cons)
        {
            var result = await _skintypeService.UpdateSkintypeConsAsync(skintypeId, cons);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype cons updated");
        }

        [HttpPut("updateSkintypeSkincareGuide/{skintypeId}")]
        public async Task<IActionResult> UpdateSkintypeSkincareGuide(int skintypeId, [FromBody] string skincareGuide)
        {
            var result = await _skintypeService.UpdateSkintypeSkincareGuideAsync(skintypeId, skincareGuide);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype skincare guide updated");
        }

        [HttpPut("updateSkintypeIntroduction/{skintypeId}")]
        public async Task<IActionResult> UpdateSkintypeIntroduction(int skintypeId, [FromBody] string introduction)
        {
            var result = await _skintypeService.UpdateSkintypeIntroductionAsync(skintypeId, introduction);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype introduction updated");
        }

        [HttpPut("updateSkintype")]
        public async Task<IActionResult> UpdateSkintype([FromBody] SkintypeDTO skintypeDTO)
        {
            var result = await _skintypeService.UpdateSkintypeAsync(skintypeDTO);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype updated");
        }

        [HttpDelete("deleteSkintype/{skintypeId}")]
        public async Task<IActionResult> DeleteSkintype(int skintypeId)
        {
            var result = await _skintypeService.DeleteSkintypeAsync(skintypeId);
            if (!result)
            {
                return NotFound("Skintype not found");
            }
            return Ok("Skintype deleted");
        }
    }
}
