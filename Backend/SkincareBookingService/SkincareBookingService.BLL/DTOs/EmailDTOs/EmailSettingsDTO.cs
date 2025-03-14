namespace SkincareBookingService.BLL.DTOs.EmailDTOs
{
    public class EmailSettingsDTO
    {
        public string Mail { get; set; }
        public string DisplayName { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string Password { get; set; }
    }
}