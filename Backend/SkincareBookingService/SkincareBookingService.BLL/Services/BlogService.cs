using SkincareBookingService.BLL.DTOs;
using SkincareBookingService.BLL.Interfaces;
using SkincareBookingService.DAL.Entities;
using SkincareBookingService.DAL.Interfaces;

namespace SkincareBookingService.BLL.Services
{
    public class BlogService : IBlogService
    {
        private readonly IGenericRepository<Blog> _blogRepository;

        public BlogService(IGenericRepository<Blog> blogRepository)
        {
            _blogRepository = blogRepository;
        }

        public async Task<BlogDTO> CreateBlogAsync(BlogDTO blogDTO)
        {
            var blog = new Blog
            {
                Title = blogDTO.Title,
                Content = blogDTO.Content,
                Image = blogDTO.Image,
                CreateAt = blogDTO.CreateAt,
                CustomerId = blogDTO.CustomerId
            };

            await _blogRepository.AddAsync(blog);
            await _blogRepository.SaveChangesAsync();

            return new BlogDTO
            {
                BlogId = blog.BlogId,
                Title = blog.Title,
                Content = blog.Content,
                Image = blog.Image,
                CreateAt = blog.CreateAt,
                CustomerId = blog.CustomerId
            };
        }

        public async Task<bool> DeleteBlogAsync(int blogId)
        {
            var blog = await _blogRepository.GetByIdAsync(blogId);

            if (blog == null) return false;

            await _blogRepository.DeleteAsync(blog);
            await _blogRepository.SaveChangesAsync();
            return true;
        }

        public async Task<List<BlogDTO>> GetAllBlogsAsync()
        {
            var blogs = await _blogRepository.GetAllAsync();

            return blogs.Select(b => new BlogDTO
            {
                BlogId = b.BlogId,
                Title = b.Title,
                Content = b.Content,
                Image = b.Image,
                CreateAt = b.CreateAt,
                CustomerId = b.CustomerId
            }).ToList();
        }

        public async Task<BlogDTO> GetBlogByIdAsync(int blogId)
        {
            var blog = await _blogRepository.GetByIdAsync(blogId);

            if (blog == null)
            {
                return null;
            }

            return new BlogDTO
            {
                BlogId = blog.BlogId,
                Title = blog.Title,
                Content = blog.Content,
                Image = blog.Image,
                CreateAt = blog.CreateAt,
                CustomerId = blog.CustomerId
            };
        }

        public async Task<bool> UpdateBlogAsync(BlogDTO blogDTO)
        {
            var blog = await _blogRepository.FirstOrDefaultAsync(b => b.BlogId == blogDTO.BlogId);

            if (blog == null)
            {
                return false;
            }

            blog.Title = blogDTO.Title;
            blog.Content = blogDTO.Content;
            blog.Image = blogDTO.Image;
            blog.CreateAt = blogDTO.CreateAt;
            blog.CustomerId = blogDTO.CustomerId;

            await _blogRepository.UpdateAsync(blog);
            await _blogRepository.SaveChangesAsync();
            return true;
        }
    }
}
