using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
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



}



