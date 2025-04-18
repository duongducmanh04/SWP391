﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace SkincareBookingService.DAL.Entities;

public partial class Booking
{
    public int BookingId { get; set; }

    public int? CustomerId { get; set; }

    public string Location { get; set; }

    public DateTime? Date { get; set; }

    public DateTime? CreateAt { get; set; }

    public string Status { get; set; }

    public decimal? Amount { get; set; }

    public int? SkintherapistId { get; set; }

    public DateTime? UpdateAt { get; set; }

    public string ServiceName { get; set; }

    public int? ServiceId { get; set; }

    public string Note { get; set; }

    public virtual Customer Customer { get; set; }

    public virtual SkinTherapist Skintherapist { get; set; }

    public virtual ICollection<Slot> Slots { get; set; } = new List<Slot>();
}