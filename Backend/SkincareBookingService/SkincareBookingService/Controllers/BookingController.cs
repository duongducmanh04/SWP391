using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs.BookingDTOss;
using SkincareBookingService.BLL.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly ISlotService _slotService;

    public BookingController(IBookingService bookingService, ISlotService slotService)
    {
        _bookingService = bookingService;
        _slotService = slotService;
    }

    [HttpPost("create-booking")]
    public async Task<IActionResult> CreateBooking([FromBody] PostBookingDTO booking, int slotId)
    {
        var validationResult = await ValidateBookingRequest(booking, slotId);
        if (validationResult != null)
        {
            return validationResult;
        }

        var result = await _bookingService.CreateBooking(booking, slotId);
        if (result)
        {
            return Ok(new { message = "Booking created successfully." });
        }
        else
        {
            return BadRequest(new { message = "Failed to create booking. The slot may be already booked or does not exist." });
        }
    }

    private async Task<IActionResult> ValidateBookingRequest(PostBookingDTO booking, int slotId)
    {
        if (booking == null)
            return BadRequest(new { message = "Booking data is null." });

        if (slotId <= 0)
            return BadRequest(new { message = "Invalid slot id." });

        if (booking.CustomerId <= 0 || booking.SkintherapistId <= 0)
            return BadRequest(new { message = "Invalid customer or skintherapist id." });

        // Assuming you have a method to check if the slot is already booked
        var slot = await _slotService.GetSlotByIdAsync(slotId);
        if (slot == null)
            return BadRequest(new { message = "Slot does not exist." });

        if (slot.Status == "Booked")
            return BadRequest(new { message = "Slot is already booked." });

        return null;
    }

    [HttpGet("getAllBookings")]
    public async Task<IActionResult> GetBookings()
    {
        var bookings = await _bookingService.GetBookingsAsync();
        if (bookings == null || bookings.Count == 0)
        {
            return NotFound("No bookings found");
        }

        return Ok(bookings);
    }

    [HttpGet("booked/{bookingStatus}")]
    public async Task<IActionResult> GetBookingsWithStatus(string bookingStatus)
    {
        var bookings = await _bookingService.GetBookingsByStatusAsync(bookingStatus);
        if (bookings == null || bookings.Count == 0)
        {
            return NotFound("No bookings found with that status");
        }

        return Ok(bookings);
    }

    [HttpGet("getBookingById/{bookingId}")]
    public async Task<IActionResult> GetBookingById(int bookingId)
    {
        var booking = await _bookingService.GetBookingByIdAsync(bookingId);
        if (booking == null)
        {
            return NotFound("Booking not found");
        }
        return Ok(booking);
    }

    [HttpGet("getBookingByCustomerId/{customerId}")]
    public async Task<IActionResult> GetBookingByCustomerId(int customerId)
    {
        if (customerId <= 0)
        {
            return BadRequest(new { message = "Invalid customer id." });
        }

        var bookings = await _bookingService.GetBookingByCustomerIdAsync(customerId);
        if (bookings == null || bookings.Count == 0)
        {
            return NotFound(new { message = "No bookings found for that customer" });
        }
        return Ok(bookings);
    }

    [HttpGet("previousBooking/{customerId}")]
    public async Task<IActionResult> GetPreviousBookings(int customerId)
    {
        if (customerId == null || customerId <= 0)
        {
            return BadRequest("Invalid customer id");
        }

        var result = await _bookingService.GetBookingsByCustomerId(customerId);
        return Ok(result);
    }

    [HttpGet("getBookingBySkintherapistId/{skintherapistId}")]
    public async Task<IActionResult> GetBookingBySkintherapistId(int skintherapistId)
    {
        if (skintherapistId <= 0)
        {
            return BadRequest(new { message = "Invalid skintherapist id." });
        }
        var bookings = await _bookingService.GetBookingBySkintherapistIdAsync(skintherapistId);
        if (bookings == null || bookings.Count == 0)
        {
            return NotFound(new { message = "No bookings found for that skintherapist" });
        }
        return Ok(bookings);
    }

    [HttpGet("getBookingByServiceId/{serviceId}")]
    public async Task<IActionResult> GetBookingByServiceId(int serviceId)
    {
        if (serviceId <= 0)
        {
            return BadRequest(new { message = "Invalid service id." });
        }
        var bookings = await _bookingService.GetBookingByServiceIdAsync(serviceId);
        if (bookings == null || bookings.Count == 0)
        {
            return NotFound(new { message = "No bookings found for that service" });
        }
        return Ok(bookings);
    }

    

    // ===================== UPDATE METHODS =====================

    [HttpPut("checkin/{bookingId}")]
    public async Task<IActionResult> UpdateBookingStatusToCheckIn(int bookingId)
    {
        var result = await _bookingService.UpdateBookingStatusToCheckInAsync(bookingId);

        if (result)
        {
            return Ok(new { message = "Booking status updated to 'CheckIn' successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("finished/{bookingId}")]
    public async Task<IActionResult> UpdateBookingStatusToFinished(int bookingId)
    {
        var result = await _bookingService.UpdateStatusToFinishedAsync(bookingId);

        if (result)
        {
            return Ok(new { message = "Booking status updated to 'Finished' successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("completed/{bookingId}")]
    public async Task<IActionResult> UpdateBookingStatusToCompleted(int bookingId)
    {
        var result = await _bookingService.UpdateStatusToCompletedAsync(bookingId);

        if (result)
        {
            return Ok(new { message = "Booking status updated to 'Completed' successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("denied/{bookingId}")]
    public async Task<IActionResult> UpdateBookingStatusToDenied(int bookingId)
    {
        var result = await _bookingService.UpdateStatusToDeniedAsync(bookingId);

        if (result)
        {
            return Ok(new { message = "Booking status updated to 'Denied' successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("cancelled/{bookingId}")]
    public async Task<IActionResult> UpdateBookingStatusToCancelled(int bookingId)
    {
        if(bookingId <= 0 || bookingId == null)
        {
            return BadRequest(new { message = "Invalid booking id." });
        }
        var result = await _bookingService.UpdateStatusToCancelledAsync(bookingId);

        if (result)
        {
            return Ok(new { message = "Booking status updated to 'Cancelled' successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("serviceName/{bookingId}")]
    public async Task<IActionResult> UpdateBookingService(int bookingId, string serviceName)
    {
        var result = await _bookingService.UpdateBookingServiceAsync(bookingId, serviceName);
        if (result)
        {
            return Ok(new { message = "Booking service updated successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("amount/{bookingId}")]
    public async Task<IActionResult> UpdateBookingAmount(int bookingId, float amount)
    {
        var result = await _bookingService.UpdateBookingAmountAsync(bookingId, amount);
        if (result)
        {
            return Ok(new { message = "Booking amount updated successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("date/{bookingId}")]
    public async Task<IActionResult> UpdateBookingDate(int bookingId, DateTime date)
    {
        var result = await _bookingService.UpdateBookingDateAsync(bookingId, date);
        if (result)
        {
            return Ok(new { message = "Booking date updated successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("location/{bookingId}")]
    public async Task<IActionResult> UpdateBookingLocation(int bookingId, string location)
    {
        var result = await _bookingService.UpdateBookingLocationAsync(bookingId, location);
        if (result)
        {
            return Ok(new { message = "Booking location updated successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("skintherapist/{bookingId}")]
    public async Task<IActionResult> UpdateBookingSkintherapist(int bookingId, int skintherapistId)
    {
        var result = await _bookingService.UpdateBookingSkintherapistAsync(bookingId, skintherapistId);
        if (result)
        {
            return Ok(new { message = "Booking skintherapist updated successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }

    [HttpPut("note/{bookingId}")]
    public async Task<IActionResult> UpdateBookingNote(int bookingId, string note)
    {
        var result = await _bookingService.UpdateBookingNoteAsync(bookingId, note);
        if (result)
        {
            return Ok(new { message = "Booking note updated successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }
}



