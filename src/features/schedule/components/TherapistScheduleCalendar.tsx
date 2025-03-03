import { Calendar, Spin, Flex, Tooltip } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useGetScheduleByTherapistId } from "../hooks/useGetScheduleByTherapistId";
import { useSlots } from "../../services/hooks/useGetSlot";
import { useBookingss } from "../../booking/hooks/useGetBooking";
import { ScheduleDto } from "../dto/schedule.dto";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { SlotDto } from "../../services/dto/slot.dto";
import { BookingDto } from "../../booking/dto/booking.dto";
import useAuthStore from "../../authentication/hooks/useAuthStore";
import { useMemo } from "react";

const TherapistScheduleView = () => {
  const { user } = useAuthStore();
  const accountId = user?.accountId;
  const { data: therapists, isLoading: loadingTherapists } = useTherapists();

  const skintherapistId = useMemo(() => {
    if (!therapists || therapists.length === 0 || !accountId) return undefined;

    const therapist = therapists.find(
      (t) => Number(t.accountId) === Number(accountId)
    );

    return therapist?.skintherapistId;
  }, [therapists, accountId]);

  const { data: schedule, isLoading: loadingSchedule } =
    useGetScheduleByTherapistId(skintherapistId ?? 0);

  const { data: slots, isLoading: loadingSlots } = useSlots();
  const { data: bookings, isLoading: loadingBookings } = useBookingss();

  //   const dateCellRender = (value: Dayjs) => {
  //     if (!schedule || !Array.isArray(schedule) || !slots || !bookings)
  //       return null;

  //     const formattedDate = value.format("YYYY-MM-DD");

  //     const scheduleForTherapist = schedule.filter(
  //       (s: ScheduleDto) => s.skinTherapistId === skintherapistId
  //     );

  //     const slotMap = new Map(slots.map((slot: SlotDto) => [slot.slotId, slot]));

  //     const bookingsForDate = bookings.filter((booking: BookingDto) => {
  //       return scheduleForTherapist.some((s: ScheduleDto) => {
  //         const slot = slotMap.get(s.slotId);
  //         return (
  //           slot &&
  //           slot.bookingId === booking.bookingId &&
  //           dayjs(booking.date).format("YYYY-MM-DD") === formattedDate
  //         );
  //       });
  //     });

  //     const tooltipContent = (
  //       <ul>
  //         {bookingsForDate.map((booking: BookingDto) => {
  //           const slot = slots.find((s) => s.bookingId === booking.bookingId);
  //           return (
  //             <li key={booking.bookingId}>
  //               {slot ? slot.time : ""} - {booking.serviceName}
  //             </li>
  //           );
  //         })}
  //       </ul>
  //     );

  //     const cellContent = (
  //       <ul>
  //         {bookingsForDate.map((booking: BookingDto) => {
  //           const slot = slots.find((s) => s.bookingId === booking.bookingId);
  //           return <li key={booking.bookingId}>{slot ? slot.time : ""}</li>;
  //         })}
  //       </ul>
  //     );

  //     return (
  //       <Tooltip title={tooltipContent} placement="top">
  //         <div>{cellContent}</div>
  //       </Tooltip>
  //     );
  //   };

  const dateCellRender = (value: Dayjs) => {
    if (!schedule || !Array.isArray(schedule) || !slots || !bookings)
      return null;

    const formattedDate = value.format("YYYY-MM-DD");

    const bookedSlots = slots.filter(
      (slot: SlotDto) => slot.status === "Booked"
    );
    const slotMap = new Map(bookedSlots.map((slot) => [slot.slotId, slot]));

    const scheduleForTherapist = schedule.filter(
      (s: ScheduleDto) => s.skinTherapistId === skintherapistId
    );

    const bookingsForDate = bookings.filter((booking: BookingDto) => {
      return scheduleForTherapist.some((s: ScheduleDto) => {
        const slot = slotMap.get(s.slotId);
        return (
          slot &&
          slot.bookingId === booking.bookingId &&
          dayjs(booking.date).format("YYYY-MM-DD") === formattedDate
        );
      });
    });

    if (bookingsForDate.length === 0) return null;

    const tooltipContent = (
      <ul>
        {bookingsForDate.map((booking: BookingDto) => {
          const slot = bookedSlots.find(
            (s) => s.bookingId === booking.bookingId
          );
          return (
            <li key={booking.bookingId}>
              {slot ? slot.time : "Unknown"} - {booking.serviceName}
            </li>
          );
        })}
      </ul>
    );

    const cellContent = (
      <ul>
        {bookingsForDate.map((booking: BookingDto) => {
          const slot = bookedSlots.find(
            (s) => s.bookingId === booking.bookingId
          );
          return (
            <li key={booking.bookingId}>{slot ? slot.time : "Unknown"}</li>
          );
        })}
      </ul>
    );

    return (
      <Tooltip title={tooltipContent} placement="top">
        <div>{cellContent}</div>
      </Tooltip>
    );
  };

  return (
    <div>
      <Flex gap="middle" justify="space-between">
        <div className="content-header">Lịch làm việc của chuyên viên</div>
      </Flex>
      <hr style={{ opacity: 0.1 }} />

      {loadingSchedule ||
      loadingSlots ||
      loadingBookings ||
      loadingTherapists ? (
        <Spin size="large" />
      ) : (
        <Calendar dateCellRender={dateCellRender} />
      )}
    </div>
  );
};

export default TherapistScheduleView;
