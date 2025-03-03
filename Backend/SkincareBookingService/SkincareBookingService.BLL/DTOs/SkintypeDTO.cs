using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs
{
    public class SkintypeDTO
    {
        public int SkintypeId { get; set; }
        public string SkintypeName { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Status { get; set; }
        public string Pros { get; set; }
        public string Cons { get; set; }
        public string SkincareGuide { get; set; }
        public string Introduction { get; set; }
    }
}
