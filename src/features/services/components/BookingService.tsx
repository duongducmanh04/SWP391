import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Calendar,
  Button,
  message,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { useCreateBooking } from "../../booking/hooks/useCreateBooking";
import useAuthStore from "../../authentication/hooks/useAuthStore";
import { useAvailableSlot } from "../hooks/useAvailableSlot";
import utc from "dayjs/plugin/utc";
import { useGetCustomers } from "../hooks/useGetCustomers";
import { CreateBookingDto } from "../../booking/dto/create-booking.dto";
import { useGetSchedule } from "../hooks/useGetSchedule";
import { useNavigate } from "react-router-dom";
import { PagePath } from "../../../enums/page-path.enum"; 


 
dayjs.extend(utc);

const { Title, Text } = Typography;

const SkincareBooking = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const location = useLocation();
  const { mutate: createBooking } = useCreateBooking();
  const { user } = useAuthStore();
  const { data: therapists =[] } = useTherapists();
  const { data: availableSlots } = useAvailableSlot(); 
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const { data: customers, isLoading, error } = useGetCustomers(); 
  const { amount, serviceId,serviceName } = location.state || {};
  const { data: schedules } = useGetSchedule(serviceId);
  const navigate = useNavigate();
  
 

  useEffect(() => {
    console.log("🛠️ Re-rendering: Selected Date changed:", selectedDate);
  }, [selectedDate]);

  if (isLoading) return <p>Loading customers...</p>;
  if (error) {
    console.error("❌ Error fetching customers:", error);
    return <p>Error loading customers.</p>;
  }

  const getAvailableSlotsForTherapist = (therapistId: number) => {
    if (!schedules || !availableSlots) {
      console.warn("⚠️ No schedules or available slots found!");
      return [];
    }
  
    const flatSchedules = schedules.flat(); 
  
    console.log("📡 Debugging: Full Flattened Schedules Data:", JSON.stringify(flatSchedules, null, 2));
    console.log("📡 Debugging: Raw Available Slots:", availableSlots);
  
    const scheduleSlotIds = flatSchedules.map((schedule) => schedule.slotId || "MISSING_SLOT_ID");
    const availableSlotIds = availableSlots.map((slot) => slot.slotId);
  
    console.log("🔍 All Schedule Slot IDs:", scheduleSlotIds);
    console.log("🔍 All Available Slot IDs:", availableSlotIds);
  
    return flatSchedules
      .filter((schedule) => {
        const scheduleDate = dayjs(schedule.date).format("YYYY-MM-DD");
        const isDateMatch = scheduleDate === selectedDate;
        const isTherapistMatch = schedule.skinTherapistId === therapistId;
  
        if (!schedule.slotId) {
          console.warn(`⚠️ Schedule missing slotId:`, schedule);
          return false;
        }
  
        const matchingSlot = availableSlots.find((slot) => slot.slotId === schedule.slotId && slot.status === "Available");
  
        console.log(`🧐 Checking Schedule - Date: ${scheduleDate}, Therapist ID: ${schedule.skinTherapistId}, Slot ID: ${schedule.slotId}, Match: ${!!matchingSlot}`);
  
        return isDateMatch && isTherapistMatch && matchingSlot;
      })
      .map((schedule) => {
        const matchingSlot = availableSlots.find((slot) => slot.slotId === schedule.slotId && slot.status === "Available");
  
        console.log(`🔗 Matched Slot for Schedule Slot ID ${schedule.slotId}:`, matchingSlot);
  
        return matchingSlot
          ? {
              time: dayjs(matchingSlot.time, ["h:mm A", "HH:mm"]).format("HH:mm"),
              slotId: matchingSlot.slotId,
            }
          : null;
      })
      .filter((slot) => slot !== null)
      .sort((a, b) => dayjs(a.time, "HH:mm").isBefore(dayjs(b.time, "HH:mm")) ? -1 : 1); 
  };
  
  
  
  

  const handleSelectExpert = (id: number, time: string, slotId: number) => {
    setSelectedExpert(id);
    setSelectedTime(time);
    setSelectedSlotId(slotId); 
  };
  


dayjs.extend(utc); 

const handleConfirmBooking = async () => {
  if (!selectedExpert || !selectedTime || !selectedSlotId) { 
    message.warning("Vui lòng chọn chuyên viên, thời gian và slot!");
    return;
  }

  if (!user || !user.accountId) {
    message.error("Lỗi: Không tìm thấy thông tin tài khoản!");
    console.error("❌ User object is missing:", user);
    return;
  }

  if (!customers || customers.length === 0) {
    message.error("Lỗi: Danh sách khách hàng trống hoặc chưa tải xong!");
    console.error("❌ Customers not loaded or empty:", customers);
    return;
  }

  const matchedCustomer = customers.find(c => Number(c.accountId) === Number(user.accountId));

  if (!matchedCustomer) {
    message.error("Lỗi: Không tìm thấy khách hàng phù hợp!");
    console.error("❌ No matching customer for accountId:", user.accountId);
    return;
  }

  if (!selectedSlotId) {
    message.error("Lỗi: Không tìm thấy slot đã chọn!");
    console.error("❌ Missing slotId:", selectedSlotId);
    return;
  }
  const selectedTherapist = therapists.find(t => t.skintherapistId === selectedExpert);
const therapistName = selectedTherapist ? selectedTherapist.name : "Không rõ";

if (!selectedTherapist) {
  console.warn("⚠️ Không tìm thấy thông tin chuyên viên!", selectedExpert);
}

  // ✅ Construct booking data
  const bookingData: CreateBookingDto = {
    customerId: matchedCustomer.customerId,
    location: "hcm",
    amount: amount,
    serviceId: serviceId,
    skintherapistId: selectedExpert,
    status: "",
    slotId: selectedSlotId,
  };

  console.log("📦 Final Booking Data:", bookingData);
  console.log("📡 API Request URL:", `https://localhost:7071/api/Booking/create-booking?slotId=${selectedSlotId}`);
  console.log("📦 Request Body:", bookingData);
  console.log("👉 `amount`:", amount);
  console.log("👉 `serviceId`:", serviceId);
  console.log("🩺 Mapped Therapist Name:", therapistName);

  createBooking(bookingData, {
    onSuccess: () => {
      message.success("Đặt lịch thành công!"); 

     
      navigate(PagePath.BOOKING_INFO_CONFIRM, { 
        state: { 
          serviceName: serviceName, 
          amount: amount,
          selectedDate: selectedDate,
          selectedTime: selectedTime,
          therapistName:  therapistName,
          bookingLocation: "HCM" 
        }
      });
    },
    onError: (err: Error) => {
      console.error("❌ API Error:", err);
      message.error("Đặt lịch thất bại, vui lòng thử lại!");
    },
  });
};


  return (
    <div style={{ backgroundColor: "#F1EBE4", borderRadius: "12px", textAlign: "center" }}>
      <Title level={2} style={{ color: "#3A5A40", fontSize: "32px", fontWeight: "bold", marginBottom: "40px" }}>
        Đặt Lịch Chăm Sóc Da
      </Title>

      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={18}>
          <Card
            title="Lịch làm việc"
            bordered={false}
            style={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          >
            <Calendar
              cellRender={(value) => {
                const isPast = value.isBefore(dayjs(), "day");
                return isPast ? null : (
                  <div style={{ paddingLeft: "5px" }}>
                    
                  </div>
                );
              }}
              disabledDate={(current) => current.isBefore(dayjs(), "day")}
              onSelect={(value) => {
                const newDate = value.format("YYYY-MM-DD");
                console.log("📅 Selected Date:", newDate);
                setSelectedDate(newDate);
              }}
            />
          </Card>
        </Col>

     
        <Col xs={24} md={6}>
          <Card
            title="Thông tin chuyên viên"
            bordered={false}
            style={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          >
            {selectedDate ? (
              <div>
                <Text strong style={{ fontSize: "16px" }}>Ngày đã chọn: {selectedDate}</Text>
                <div style={{ marginTop: "20px" }}>
                  {therapists?.map((expert) => {
                    const availableTimes = getAvailableSlotsForTherapist(expert.skintherapistId); 
                    if (availableTimes.length === 0) return null;

                    return (
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
                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <Row justify="center" align="middle">
                          <Col span={24} style={{ textAlign: "center" }}>
                            <Title level={4} style={{ marginTop: "10px", color: "#3A5A40" }}>
                              {expert.name}
                            </Title>
                          </Col>
                        </Row>

                        <Row gutter={[8, 8]} justify="center" style={{ marginTop: "10px" }}>
  {getAvailableSlotsForTherapist(expert.skintherapistId).map(({ time, slotId }) => (
    <Col key={`${expert.skintherapistId}-${slotId}`} xs={8} sm={8} md={8}>
      <Button
        type={selectedExpert === expert.skintherapistId && selectedTime === time ? "primary" : "default"}
        onClick={() => handleSelectExpert(expert.skintherapistId, time, slotId)}
        style={{
          width: "100%",
          borderRadius: "20px",
          fontSize: "14px",
          padding: "8px 16px",
          backgroundColor: "white",
          color: "#3A5A40",
          border: "1px solid #A7C957",
          cursor: "pointer",
        }}
      >
        {time}
      </Button>
    </Col>
  ))}
</Row>
                      </Card>
                    );
                  })}
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
  onClick={handleConfirmBooking} 
  style={{
    backgroundColor: "#A7C957",
    border: "none",
    fontSize: "16px",
    padding: "12px 24px",
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#8AA851")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#A7C957")}
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
