using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs
{
    public class CustomerDTO
    {
        public int CustomerId { get; set; }

        public string Name { get; set; }

        public int? SkintypeId { get; set; }

        public int? AccountId { get; set; }

        public string PhoneNumber { get; set; }

        public string Image { get; set; }

        public string Email { get; set; }
    }
}
