namespace SkincareBookingService.BLL.DTOs
{
    public class SkinTherapistDTO
        {
            public int SkintherapistId { get; set; }
            public string Name { get; set; }
            public string Speciality { get; set; }
            public string Email { get; set; }
            public string Experience { get; set; }
            public string Image { get; set; }

            public string Degree { get; set; }
            public int? AccountId { get; set; }
        }
 
}
