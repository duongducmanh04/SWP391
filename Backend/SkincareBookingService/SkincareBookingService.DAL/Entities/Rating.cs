﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace SkincareBookingService.DAL.Entities;

public partial class Rating
{
    public int RatingId { get; set; }

    public int CustomerId { get; set; }

    public DateTime? CreateAt { get; set; }

    public int Stars { get; set; }

    public int ServiceId { get; set; }

    public string Feedback { get; set; }

    public virtual Customer Customer { get; set; }

    public virtual Service Service { get; set; }
}