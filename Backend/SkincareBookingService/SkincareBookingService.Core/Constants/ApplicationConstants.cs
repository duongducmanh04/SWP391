namespace SkincareBookingService.Core.Constants
{
    
    public static class ApplicationConstants
    {
        #region Customer Roles
        public const string CustomerRole = "Customer";  
        #endregion

        #region Staff Roles
        public const string StaffRole = "Staff";  
        #endregion

        #region Skin Therapist Roles
        public const string SkinTherapistRole = "SkinTherapist";  
        #endregion

        #region Manager Roles
        public const string ManagerRole = "Manager";  
        #endregion

        #region Service Types
        public const string SingleService = "SingleService";  
        public const string PackageService = "PackageService";  
        #endregion

        #region Booking Status
        public const string BookedStatus = "Booked";  
        public const string CheckInStatus = "CheckIn";  
        public const string FinishedStatus = "Finished";  
        public const string CompletedStatus = "Completed";  
        public const string CanceledStatus = "Canceled";  
        public const string DeniedStatus = "Denied";
        #endregion


        /*
        This class contains constants related to user roles, service types, 
        and the status of the booking in the system. These constants help maintain properties 
        be consistent throughout the application and avoid repeating string values ​​in the source code.
        */
    }
}
