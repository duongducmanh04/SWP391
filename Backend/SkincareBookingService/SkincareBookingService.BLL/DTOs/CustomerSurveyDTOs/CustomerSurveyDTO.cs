using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs.CustomerSurveyDTOs
{
    public class CustomerSurveyDTO
    {
        public int CustomersurveyId { get; set; }
        public DateTime? Date { get; set; }
        public int? SkintypeId { get; set; }
        public int? QuestionsId { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
