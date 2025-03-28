using SkincareBookingService.BLL.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.Interfaces
{
    public interface IBlogService
    {
        Task<BlogDTO> CreateBlogAsync(BlogDTO blogDTO);
        Task<bool> UpdateBlogAsync(int blogId, BlogDTO blogDTO);
        Task<BlogDTO> GetBlogByIdAsync(int blogId);
        Task<List<BlogDTO>> GetAllBlogsAsync();
        Task<bool> DeleteBlogAsync(int blogId);
    }
}
