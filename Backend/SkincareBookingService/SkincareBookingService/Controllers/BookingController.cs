using Microsoft.AspNetCore.Mvc;
using SkincareBookingService.BLL.DTOs;
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

    [HttpPost("create")]
    public async Task<IActionResult> CreateBooking([FromBody] BookingDTO bookingDTO)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdBooking = await _bookingService.CreateBookingAsync(bookingDTO);
        return CreatedAtAction(nameof(GetBookingById), new { bookingId = createdBooking.BookingId }, createdBooking);
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

    [HttpPut("updateService/{bookingId}/{serviceName}")]
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

    [HttpDelete("delete/{bookingId}")]
    public async Task<IActionResult> DeleteBooking(int bookingId)
    {
        var result = await _bookingService.DeleteBookingAsync(bookingId);
        if (result)
        {
            return Ok(new { message = "Booking deleted successfully." });
        }
        else
        {
            return NotFound(new { message = "Booking not found." });
        }
    }


}



