using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs.CustomerSurveyDTOs
{
    public class SubmitSurveyDTO
    {
        public int CustomerId { get; set; }
        public List<SurveyAnswerDTO> Answers { get; set; } 
    }
}
