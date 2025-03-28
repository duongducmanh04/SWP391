﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace SkincareBookingService.DAL.Entities;

public partial class Service
{
    public int ServiceId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public decimal? Price { get; set; }

    public string Image { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? Duration { get; set; }

    public string ProcedureDescription { get; set; }

    public double AverageStars { get; set; }

    public string Status { get; set; }

    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();

    public virtual ICollection<SkinTherapistService> SkinTherapistServices { get; set; } = new List<SkinTherapistService>();

    public virtual ICollection<SkintypeService> SkintypeServices { get; set; } = new List<SkintypeService>();
}