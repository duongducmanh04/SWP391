// import { useState } from "react";
// import {
//   Card,
//   Typography,
//   Row,
//   Col,
//   Calendar,
//   Badge,
//   Button,
//   Space,
//   message,
// } from "antd";
// import { CheckCircleOutlined } from "@ant-design/icons";
// import type { BadgeProps } from "antd";
// import { Dayjs } from "dayjs";
// import dayjs from "dayjs";
// import { useBookedSlot } from "../hooks/useGetBookedSlot";
// import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
// import { useBookingss } from "../../booking/hooks/useGetBooking";

// const { Title, Text } = Typography;

// interface CalendarEvent {
//   type: string;
//   content: string;
// }

// const skincareExperts = [
//   {
//     id: 1,
//     name: "Nguyễn Thị Hồng",
//     expertise: "Chăm sóc da mụn",
//     availableHours: ["10:00", "13:00", "16:00"],
//     profilePicture: "https://via.placeholder.com/100",
//   },
//   {
//     id: 2,
//     name: "Lê Văn Khánh",
//     expertise: "Chăm sóc trẻ hóa da",
//     availableHours: ["09:00", "12:00", "15:00"],
//     profilePicture: "https://via.placeholder.com/100",
//   },
// ];

// const SkincareBooking = () => {
//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
//   const [selectedTime, setSelectedTime] = useState<string>("");
//   const {
//     data: bookedSlotData,
//     isLoading: isLoadingBookedSlot,
//     error: errorBookedSlot,
//   } = useBookedSlot();

//   const {
//     data: therapistData,
//     isLoading: isLoadingTherapist,
//     error: errorTherapist,
//   } = useTherapists();

//   const {
//     data: bookingData,
//     isLoading: isLoadingBooking,
//     error: errorBooking,
//   } = useBookingss();

//   const today = dayjs().startOf("day"); // Lấy ngày hiện tại

//   const getListData = (value: Dayjs): CalendarEvent[] => {
//     const date = value.format("YYYY-MM-DD");
//     if (date === "2025-02-17") {
//       return [
//         { type: "success", content: "Nguyễn Thị Hồng - 10:00" },
//         { type: "warning", content: "Lê Văn Khánh - 09:00" },
//       ];
//     } else if (date === "2025-02-20") {
//       return [
//         { type: "success", content: "Phạm Văn Mạnh - 08:30" },
//         { type: "warning", content: "Nguyễn Thị Hường- 08:00" },
//       ];
//     } else if (date === "2025-02-23") {
//       return [
//         { type: "error", content: "Ngô Mạnh Tuấn - 08:30" },
//         { type: "processing", content: "Phạm Văn B- 09:00" },
//         { type: "warning", content: "Trần Văn Anh- 09:00" },
//       ];
//     }
//     return [];
//   };

//   const dateCellRender = (value: Dayjs) => {
//     const listData = getListData(value);
//     return (
//       <ul className="events">
//         {listData.map((item) => (
//           <li key={item.content}>
//             <Badge
//               status={item.type as BadgeProps["status"]}
//               text={item.content}
//             />
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   const disabledDate = (current: Dayjs) => {
//     return current.isBefore(today);
//   };

//   const handleSelectExpert = (id: number, time: string) => {
//     setSelectedExpert(id);
//     setSelectedTime(time);
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#F1EBE4",
//         borderRadius: "12px",
//         textAlign: "center",
//       }}
//     >
//       <Title
//         level={2}
//         style={{
//           textAlign: "center",
//           color: "#3A5A40",
//           fontSize: "32px",
//           fontWeight: "bold",
//           marginBottom: "40px",
//         }}
//       >
//         Đặt Lịch Chăm Sóc Da
//       </Title>

//       <Row gutter={[16, 16]} justify="center">
//         <Col xs={24} md={18}>
//           <Card
//             title="Lịch làm việc"
//             bordered={false}
//             style={{
//               borderRadius: "12px",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//             }}
//           >
//             <Calendar
//               cellRender={dateCellRender}
//               disabledDate={disabledDate}
//               onSelect={(value) => setSelectedDate(value.format("DD-MM-YYYY"))}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} md={6}>
//           <Card
//             title="Thông tin chuyên viên"
//             bordered={false}
//             style={{
//               borderRadius: "12px",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//             }}
//           >
//             {selectedDate ? (
//               <div>
//                 <Text strong style={{ fontSize: "16px" }}>
//                   Ngày đã chọn: {selectedDate}
//                 </Text>
//                 <div style={{ marginTop: "20px" }}>
//                   {skincareExperts.map((expert) => (
//                     <Card
//                       key={expert.id}
//                       style={{
//                         marginBottom: "10px",
//                         backgroundColor: "#f9f9f9",
//                         padding: "16px",
//                         borderRadius: "12px",
//                         transition: "all 0.3s ease-in-out",
//                       }}
//                       hoverable
//                     >
//                       <Row align="middle">
//                         <Col>
//                           <img
//                             src={expert.profilePicture}
//                             alt={expert.name}
//                             style={{
//                               width: "80px",
//                               height: "80px",
//                               borderRadius: "50%",
//                               objectFit: "cover",
//                             }}
//                           />
//                           <Title
//                             level={4}
//                             style={{ marginTop: "10px", color: "#3A5A40" }}
//                           >
//                             {expert.name}
//                           </Title>
//                           <Text style={{ color: "#6B705C" }}>
//                             {expert.expertise}
//                           </Text>

//                           <div style={{ marginTop: "10px" }}>
//                             <Space>
//                               {expert.availableHours.map((time) => (
//                                 <Button
//                                   key={time}
//                                   type={
//                                     selectedExpert === expert.id &&
//                                     selectedTime === time
//                                       ? "primary"
//                                       : "default"
//                                   }
//                                   onClick={() =>
//                                     handleSelectExpert(expert.id, time)
//                                   }
//                                   style={{
//                                     borderRadius: "20px",
//                                     fontSize: "14px",
//                                     padding: "8px 16px",
//                                   }}
//                                 >
//                                   {time}
//                                 </Button>
//                               ))}
//                             </Space>
//                           </div>
//                         </Col>
//                       </Row>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <Text style={{ color: "#888" }}>
//                 Vui lòng chọn ngày trên lịch để xem lịch làm việc.
//               </Text>
//             )}

//             {selectedExpert && (
//               <div style={{ marginTop: "20px" }}>
//                 <Title level={4}>Xác nhận đặt lịch</Title>
//                 <Text>
//                   Bạn đã chọn{" "}
//                   <strong>
//                     {skincareExperts.find((e) => e.id === selectedExpert)?.name}
//                   </strong>{" "}
//                   vào lúc <strong>{selectedTime}</strong> ngày{" "}
//                   <strong>{selectedDate}</strong>.
//                 </Text>
//                 <div style={{ marginTop: "20px" }}>
//                   <Button
//                     type="primary"
//                     icon={<CheckCircleOutlined />}
//                     onClick={() => message.success("Đặt lịch thành công")}
//                     style={{
//                       backgroundColor: "#A7C957",
//                       border: "none",
//                       fontSize: "16px",
//                       padding: "12px 24px",
//                       borderRadius: "8px",
//                       transition: "all 0.3s ease-in-out",
//                     }}
//                     onMouseOver={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#8AA851")
//                     }
//                     onMouseOut={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#A7C957")
//                     }
//                   >
//                     Xác nhận
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default SkincareBooking;
import { useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Calendar,
  Badge,
  Button,
  Space,
  message,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useBookedSlot } from "../hooks/useGetBookedSlot";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { useBookingss } from "../../booking/hooks/useGetBooking";

const { Title, Text } = Typography;

const generateSlots = () => {
  const slots = [];
  let currentTime = dayjs().set("hour", 7).set("minute", 15).set("second", 0);

  while (currentTime.hour() < 19) {
    slots.push(currentTime.format("HH:mm"));
    currentTime = currentTime.add(1, "hour").add(15, "minute");
  }

  return slots;
};

const SkincareBooking = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [slots] = useState<string[]>(generateSlots());
  const { data: therapists } = useTherapists();
  const { data: bookings } = useBookingss();
  const { data: bookedSlots } = useBookedSlot();

  const today = dayjs().startOf("day");

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return ""; 
    return dayjs(dateString).format("YYYY-MM-DD"); 
  };
  
  const getBookedSlotsForDate = (date: string): string[] => {
    if (!bookedSlots || !bookings || bookedSlots.length === 0 || bookings.length === 0) {
      console.warn("⚠️ API data not ready yet!");
      return [];
    }
  
    console.log("🛠 Raw API Booked Slots:", bookedSlots);
    console.log("🛠 Raw API Bookings:", bookings);
  
    const bookedTimes = bookedSlots
      .filter((slot) => {
        const booking = bookings.find((b) => b.bookingId === slot.bookingId);
  
        if (!booking) {
          console.warn("⚠️ No matching booking for slot:", slot);
          return false;
        }
  
        const normalizedBookingDate = booking.date.split("T")[0]; // Extract YYYY-MM-DD
        const normalizedSlotTime = dayjs(slot.time, ["h:mm A", "HH:mm"]).format("HH:mm");
  
        console.log("📌 Checking Booking:", booking);
        console.log("📆 Booking Date (API):", booking.date);
        console.log("📆 Normalized Date:", normalizedBookingDate);
        console.log("⏰ Slot Time:", slot.time, "| Status:", slot.status);
  
        const isBooked = 
          normalizedBookingDate === date &&
          slot.status === "Booked" &&
          slot.time; // Ensure slot has a valid time
  
        if (isBooked) {
          console.log("✅ Booked Slot Found:", normalizedSlotTime);
        }
  
        return isBooked;
      })
      .map((slot) => dayjs(slot.time, ["h:mm A", "HH:mm"]).format("HH:mm"));
  
    console.log("🔴 Final Booked Slots for", date, ":", bookedTimes);
    return bookedTimes;
  };
  
  
  const getMorningAndAfternoonRange = (date: string) => {
    const bookedSlotsForDate = getBookedSlotsForDate(date);
    
   
    const availableSlots = slots.filter((slot) => !bookedSlotsForDate.includes(slot));
  
   
    const morningSlots = availableSlots.filter((slot) => dayjs(slot, "HH:mm").hour() < 12);
    const morningRange =
      morningSlots.length > 0
        ? `${morningSlots[0]} - ${morningSlots[morningSlots.length - 1]}`
        : "Không có";
  
   
    const afternoonSlots = availableSlots.filter((slot) => dayjs(slot, "HH:mm").hour() >= 13);
    const afternoonRange =
      afternoonSlots.length > 0
        ? `${afternoonSlots[0]} - ${afternoonSlots[afternoonSlots.length - 1]}`
        : "Không có";
  
    return { morningRange, afternoonRange };
  };
  
  const dateCellRender = (value: Dayjs) => {
    const date = value.format("YYYY-MM-DD");
    const { morningRange, afternoonRange } = getMorningAndAfternoonRange(date);
  
    return (
      <div>
        {morningRange !== "Không có" && (
          <div>
          
            <div>{morningRange}</div> 
          </div>
        )}
        {afternoonRange !== "Không có" && (
          <div style={{ marginTop: "5px" }}>
          
            <div>{afternoonRange}</div> 
          </div>
        )}
      </div>
    );
  };

  const disabledDate = (current: Dayjs) => {
    return current.isBefore(today);
  };

  const handleSelectExpert = (id: number, time: string) => {
    setSelectedExpert(id);
    setSelectedTime(time);
  };

  return (
    <div
      style={{
        backgroundColor: "#F1EBE4",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: "#3A5A40",
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "40px",
        }}
      >
        Đặt Lịch Chăm Sóc Da
      </Title>

      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={18}>
          <Card
            title="Lịch làm việc"
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Calendar
              cellRender={dateCellRender}
              disabledDate={disabledDate}
              onSelect={(value) => setSelectedDate(value.format("YYYY-MM-DD"))}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card
            title="Thông tin chuyên viên"
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {selectedDate ? (
              <div>
                <Text strong style={{ fontSize: "16px" }}>
                  Ngày đã chọn: {selectedDate}
                </Text>
                <div style={{ marginTop: "20px" }}>
                {therapists?.map((expert) => (
  <Card
    key={expert.skintherapistId}
    style={{
      marginBottom: "10px",
      backgroundColor: "#f9f9f9",
      padding: "16px",
      borderRadius: "12px",
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      cursor: "pointer",
    }}
    hoverable
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    }}
  >
    <Row justify="center" align="middle">
      <Col span={24} style={{ textAlign: "center" }}>
        <img
          src={expert.image}
          alt={expert.name}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <Title level={4} style={{ marginTop: "10px", color: "#3A5A40" }}>
          {expert.name}
        </Title>
        <Text style={{ color: "#6B705C" }}>{expert.expertise}</Text>
      </Col>
    </Row>

  
    <Row gutter={[8, 8]} justify="center" style={{ marginTop: "10px" }}>
  {slots.map((time) => {
    const isBooked = getBookedSlotsForDate(selectedDate).includes(time);

    return (
      <Col key={time} xs={8} sm={8} md={8}>
        <Button
          type={selectedExpert === expert.skintherapistId && selectedTime === time ? "primary" : "default"}
          onClick={() => handleSelectExpert(expert.skintherapistId, time)}
          disabled={isBooked} 
          style={{
            width: "100%",
            borderRadius: "20px",
            fontSize: "14px",
            padding: "8px 16px",
            transition: "all 0.3s ease-in-out",
            backgroundColor: isBooked ? "#ff4d4f" : "white", 
            color: isBooked ? "white" : "#3A5A40",
            border: isBooked ? "1px solid #ff7875" : "1px solid #A7C957",
            cursor: isBooked ? "not-allowed" : "pointer",
          }}
        >
          {time}
        </Button>
      </Col>
    );
  })}
</Row>
  </Card>
))}
                </div>
              </div>
            ) : (
              <Text style={{ color: "#888" }}>
                Vui lòng chọn ngày trên lịch để xem lịch làm việc.
              </Text>
            )}

            {selectedExpert && (
              <div style={{ marginTop: "20px" }}>
                <Title level={4}>Xác nhận đặt lịch</Title>
                <Text>
                  Bạn đã chọn{" "}
                  <strong>
                    {
                      therapists?.find(
                        (e) => e.skintherapistId === selectedExpert
                      )?.name
                    }
                  </strong>{" "}
                  vào lúc <strong>{selectedTime}</strong> ngày{" "}
                  <strong>{selectedDate}</strong>.
                </Text>
                <div style={{ marginTop: "20px" }}>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => message.success("Đặt lịch thành công")}
                    style={{
                      backgroundColor: "#A7C957",
                      border: "none",
                      fontSize: "16px",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease-in-out",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#8AA851")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#A7C957")
                    }
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SkincareBooking;
