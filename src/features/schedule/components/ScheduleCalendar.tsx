// import { useState } from "react";
// import { Select, Calendar, Spin, Flex } from "antd";
// import type { Dayjs } from "dayjs";
// import dayjs from "dayjs";
// import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
// import { useGetScheduleByTherapistId } from "../hooks/useGetScheduleByTherapistId";
// import { useSlots } from "../../services/hooks/useGetSlot";
// import { ScheduleDto } from "../dto/schedule.dto";
// import { SlotDto } from "../../services/dto/slot.dto";

// const TherapistSchedule = () => {
//   const [selectedTherapist, setSelectedTherapist] = useState<string | null>(
//     null
//   );
//   const { data: therapists, isLoading: loadingTherapists } = useTherapists();
//   const { data: schedule, isLoading: loadingSchedule } =
//     useGetScheduleByTherapistId(selectedTherapist || "");
//   const { data: slots, isLoading: loadingSlots } = useSlots();

//   const onSelectTherapist = (value: string) => {
//     setSelectedTherapist(value);
//   };

//   const dateCellRender = (value: Dayjs) => {
//     if (!schedule || !Array.isArray(schedule) || !slots) return null;
//     const formattedDate = value.format("YYYY-MM-DD");
//     const scheduleForDate = schedule.filter(
//       (s: ScheduleDto) => dayjs(s.date).format("YYYY-MM-DD") === formattedDate
//     );

//     return (
//       <ul>
//         {scheduleForDate.map((item: ScheduleDto) => {
//           const slot = slots.find(
//             (slot: SlotDto) => slot.slotId === item.slotId
//           );
//           return <li key={item.slotId}>{slot ? `${slot.time}` : ``}</li>;
//         })}
//       </ul>
//     );
//   };

//   return (
//     <div>
//       <Flex gap="middle" justify="space-between">
//         <div className="content-header">Lịch làm việc của chuyên viên</div>
//       </Flex>
//       <hr style={{ opacity: 0.1 }} />
//       <Select
//         placeholder="Chọn chuyên viên"
//         style={{ width: "100%", marginBottom: 20 }}
//         loading={loadingTherapists}
//         onChange={onSelectTherapist}
//       >
//         {therapists?.map((therapist) => (
//           <Select.Option
//             key={therapist.skintherapistId}
//             value={therapist.skintherapistId.toString()}
//           >
//             {therapist.name}
//           </Select.Option>
//         ))}
//       </Select>

//       {loadingSchedule || loadingSlots ? (
//         <Spin size="large" />
//       ) : (
//         <Calendar dateCellRender={dateCellRender} />
//       )}
//     </div>
//   );
// };

// export default TherapistSchedule;
import { useState } from "react";
import { Select, Calendar, Spin, Flex, Tooltip } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { useGetScheduleByTherapistId } from "../hooks/useGetScheduleByTherapistId";
import { useSlots } from "../../services/hooks/useGetSlot";
import { useBookingss } from "../../booking/hooks/useGetBooking";
import { ScheduleDto } from "../dto/schedule.dto";
import { SlotDto } from "../../services/dto/slot.dto";
import { BookingDto } from "../../booking/dto/booking.dto";

const TherapistScheduleView = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(
    null
  );
  const { data: therapists, isLoading: loadingTherapists } = useTherapists();
  const { data: schedule, isLoading: loadingSchedule } =
    useGetScheduleByTherapistId(
      selectedTherapist ? parseInt(selectedTherapist) : 0
    );
  const { data: slots, isLoading: loadingSlots } = useSlots();
  const { data: bookings, isLoading: loadingBookings } = useBookingss();

  const onSelectTherapist = (value: string) => {
    setSelectedTherapist(value);
  };

  const dateCellRender = (value: Dayjs) => {
    if (!schedule || !Array.isArray(schedule) || !slots || !bookings)
      return null;
    const formattedDate = value.format("YYYY-MM-DD");
    const scheduleForTherapist = schedule.filter(
      (s) => s.skinTherapistId.toString() === selectedTherapist
    );

    const bookedSlots = slots.filter(
      (slot: SlotDto) => slot.status === "Booked"
    );

    const slotMap = new Map(bookedSlots.map((slot) => [slot.slotId, slot]));

    const bookingsForDate = bookings.filter((booking: BookingDto) => {
      return scheduleForTherapist.some((s: ScheduleDto) => {
        // const slot = slots.find((slot: SlotDto) => slot.slotId === s.slotId);
        const slot = slotMap.get(s.slotId);
        return (
          slot &&
          slot.bookingId === booking.bookingId &&
          dayjs(booking.date).format("YYYY-MM-DD") === formattedDate
        );
      });
    });

    const tooltipContent = (
      <ul>
        {bookingsForDate.map((booking: BookingDto) => {
          // const slot = slots.find(
          //   (slot: SlotDto) => slot.bookingId === booking.bookingId
          // );
          const slot = bookedSlots.find(
            (s) => s.bookingId === booking.bookingId
          );
          return (
            <li key={booking.bookingId}>
              {slot ? slot.time : ""} - {booking.serviceName}
            </li>
          );
        })}
      </ul>
    );

    const cellContent = (
      <ul>
        {bookingsForDate.map((booking: BookingDto) => {
          // const slot = slots.find(
          //   (slot: SlotDto) => slot.bookingId === booking.bookingId
          // );
          const slot = bookedSlots.find(
            (s) => s.bookingId === booking.bookingId
          );
          return <li key={booking.bookingId}>{slot ? slot.time : ""}</li>;
        })}
      </ul>
    );

    return (
      <Tooltip title={tooltipContent} placement="top">
        <div>{cellContent}</div>
      </Tooltip>
    );

    // return (
    //   <ul>
    //     {bookingsForDate.map((booking: BookingDto) => {
    //       const slot = slots.find(
    //         (slot: SlotDto) => slot.bookingId === booking.bookingId
    //       );
    //       return (
    //         <li key={booking.bookingId}>
    //           {slot ? slot.time : ""}
    //           {/* - {booking.serviceName} */}
    //         </li>
    //       );
    //     })}
    //   </ul>
    // );
  };

  return (
    <div>
      <Flex gap="middle" justify="space-between">
        <div className="content-header">Lịch làm việc của chuyên viên</div>
      </Flex>
      <hr style={{ opacity: 0.1 }} />
      <Select
        placeholder="Chọn chuyên viên"
        style={{ width: "100%", marginBottom: 20 }}
        loading={loadingTherapists}
        onChange={onSelectTherapist}
      >
        {therapists?.map((therapist) => (
          <Select.Option
            key={therapist.skintherapistId}
            value={therapist.skintherapistId.toString()}
          >
            {therapist.name}
          </Select.Option>
        ))}
      </Select>

      {loadingSchedule || loadingSlots || loadingBookings ? (
        <Spin size="large" />
      ) : (
        <Calendar dateCellRender={dateCellRender} />
      )}
    </div>
  );
};

export default TherapistScheduleView;
