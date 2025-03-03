using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs
{
    public class CustomerSurveyAnswerDTO
    {
        public int CustomersurveyanswerId { get; set; }
        public int? CustomersurveyId { get; set; }
        public int? AnswerId { get; set; }
    }
}
