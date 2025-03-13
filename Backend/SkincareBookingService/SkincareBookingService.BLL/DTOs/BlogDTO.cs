using SkincareBookingService.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs
{
    public class BlogDTO
    {
        public int BlogId { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public int? CustomerId { get; set; }

        public string Image { get; set; }

        public DateTime? CreateAt { get; set; }

        //public virtual Customer Customer { get; set; }
    }
}
