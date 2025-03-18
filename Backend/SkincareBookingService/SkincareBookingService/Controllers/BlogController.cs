using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;

namespace SkincareBookingService.Controllers
{
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpPost("createBlog")]
        public async Task<IActionResult> CreateBlog([FromBody] BlogDTO blogDTO)
        {
            var blog = await _blogService.CreateBlogAsync(blogDTO);
            return Ok(blog);
        }

        [HttpGet("getAllBlogs")]
        public async Task<IActionResult> GetBlogs()
        {
            var blogs = await _blogService.GetAllBlogsAsync();
            if (blogs == null || blogs.Count == 0)
            {
                return NotFound("No blogs found");
            }
            return Ok(blogs);
        }

        [HttpGet("getBlogById/{blogId}")]
        public async Task<IActionResult> GetBlogById(int blogId)
        {
            var blog = await _blogService.GetBlogByIdAsync(blogId);
            if (blog == null)
            {
                return NotFound("Blog not found");
            }
            return Ok(blog);
        }

        [HttpPut("updateBlog/{blogId}")]
        public async Task<IActionResult> UpdateBlog(int blogId, [FromBody] BlogDTO blogDTO)
        {
            var result = await _blogService.UpdateBlogAsync(blogId, blogDTO);
            if (!result)
            {
                return NotFound("Blog not found");
            }
            return Ok("Blog updated");
        }


        [HttpDelete("deleteBlog/{blogId}")]
        public async Task<IActionResult> DeleteBlog(int blogId)
        {
            var result = await _blogService.DeleteBlogAsync(blogId);
            if (!result)
            {
                return NotFound("Blog not found");
            }
            return Ok("Blog deleted");
        }
    }
}
