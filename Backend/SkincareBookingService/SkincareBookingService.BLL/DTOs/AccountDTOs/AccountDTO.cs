﻿using SkincareBookingService.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkincareBookingService.BLL.DTOs.AccountDTOs
{
    public class AccountDTO
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public bool Active { get; set; }
        public List<CustomerDTO> Customer { get; set; }
        public List<SkinTherapistDTO> SkinTherapists { get; set; } // Add this property
    }
}
