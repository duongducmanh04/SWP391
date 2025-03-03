import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Calendar,
  Button,
  message,
  Badge,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { useCreateBooking } from "../../booking/hooks/useCreateBooking";
import useAuthStore from "../../authentication/hooks/useAuthStore";
import { useAvailableSlot } from "../hooks/useAvailableSlot";

const { Title, Text } = Typography;

const SkincareBooking = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const location = useLocation();
  const { amount, serviceName } = location.state || {};
  const { mutate: createBooking } = useCreateBooking();
  const { user } = useAuthStore();
  const { data: therapists } = useTherapists();
  const { data: availableSlots } = useAvailableSlot();
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  useEffect(() => {
    setSelectedDate(today);
  }, [today]);

  const getAvailableSlotsForTherapist = (
    therapistId: number
  ): { time: string; slotId: number }[] => {
    if (!availableSlots || availableSlots.length === 0) return [];

    return availableSlots
      .filter((slot) => slot.status === "Available")
      .map((slot) => ({
        time: dayjs(slot.time, ["h:mm A", "HH:mm"]).format("HH:mm"),
        slotId: slot.slotId,
      }));
  };

  const handleSelectExpert = (id: number, time: string, slotId: number) => {
    setSelectedExpert(id);
    setSelectedTime(time);
    setSelectedSlotId(slotId);
  };
  const handleConfirmBooking = async () => {
    if (!selectedExpert || !selectedTime || !selectedSlotId) {
      // ✅ Ensure slotId is selected
      message.warning("Vui lòng chọn chuyên viên, thời gian và slot!");
      return;
    }

    const bookingData = {
      customerId: Number(user?.accountId) || 1,
      location: "hcm",
      amount: Number(amount),
      serviceName: serviceName,
      skintherapistId: Number(selectedExpert),
      date: new Date(selectedDate),
      slotId: selectedSlotId, // ✅ Include slotId
    };

    console.log("📌 Final Booking Data Sent to API:", bookingData);

    try {
      await createBooking(bookingData, {
        onSuccess: () => message.success("Đặt lịch thành công!"),
      });
    } catch (err) {
      console.error("❌ Unexpected Error:", err);
      message.error("Đặt lịch thất bại, vui lòng thử lại!");
    }
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
              cellRender={(value) => {
                const isPast = value.isBefore(dayjs(), "day");
                return isPast ? null : (
                  <div style={{ paddingLeft: "5px" }}>
                    <div>
                      <Badge color="#52c41a" text="Sáng" />
                    </div>
                    <div>
                      <Badge color="#52c41a" text="Chiều" />
                    </div>
                  </div>
                );
              }}
              disabledDate={(current) => current.isBefore(dayjs(), "day")}
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
                  {therapists?.map((expert) => {
                    const availableTimes = getAvailableSlotsForTherapist(
                      expert.skintherapistId
                    );

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
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <Row justify="center" align="middle">
                          <Col span={24} style={{ textAlign: "center" }}>
                            <Title
                              level={4}
                              style={{ marginTop: "10px", color: "#3A5A40" }}
                            >
                              {expert.name}
                            </Title>
                          </Col>
                        </Row>

                        <Row
                          gutter={[8, 8]}
                          justify="center"
                          style={{ marginTop: "10px" }}
                        >
                          {getAvailableSlotsForTherapist(
                            expert.skintherapistId
                          ).map(({ time, slotId }) => (
                            <Col key={time} xs={8} sm={8} md={8}>
                              <Button
                                type={
                                  selectedExpert === expert.skintherapistId &&
                                  selectedTime === time
                                    ? "primary"
                                    : "default"
                                }
                                onClick={() =>
                                  handleSelectExpert(
                                    expert.skintherapistId,
                                    time,
                                    slotId
                                  )
                                }
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
