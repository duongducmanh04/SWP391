﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace SkincareBookingService.DAL.Entities;

public partial class SkinTherapist
{
    public int SkintherapistId { get; set; }

    public string Name { get; set; }

    public string Speciality { get; set; }

    public string Email { get; set; }

    public string Experience { get; set; }

    public string Image { get; set; }

    public int? AccountId { get; set; }

    public string Degree { get; set; }

    public virtual Account Account { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();

    public virtual ICollection<SkinTherapistService> SkinTherapistServices { get; set; } = new List<SkinTherapistService>();
}