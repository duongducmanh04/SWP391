/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useLocation, useNavigate } from "react-router-dom";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { useCreateBooking } from "../../booking/hooks/useCreateBooking";
import useAuthStore from "../../authentication/hooks/useAuthStore";
import { useAvailableSlot } from "../hooks/useAvailableSlot";
import utc from "dayjs/plugin/utc";
import { useCustomers } from "../../user/hook/useGetCustomer";
import { CreateBookingDto } from "../../booking/dto/create-booking.dto";
import { PagePath } from "../../../enums/page-path.enum";

dayjs.extend(utc);

const { Title, Text } = Typography;

const SkincareBooking = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: createBooking } = useCreateBooking();
  const { user } = useAuthStore();
  const { data: therapists } = useTherapists();
  const { data: availableSlots } = useAvailableSlot();
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const { data: customers, isLoading, error } = useCustomers();
  const { amount, serviceId } = location.state || {};

  useEffect(() => {
    setSelectedDate(today);
  }, [today]);

  if (isLoading) return <p>Loading customers...</p>;
  if (error) {
    console.error("Error fetching customers:", error);
    return <p>Error loading customers.</p>;
  }

  const getAvailableSlotsForTherapist = (
    _therapistId: number
  ): { time: string; slotId: number }[] => {
    if (!availableSlots || availableSlots.length === 0) return [];

    return availableSlots
      .filter((slot: any) => {
        const slotDate = dayjs(slot.date).format("YYYY-MM-DD");
        return slot.status === "Available" && slotDate === selectedDate;
      })
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

  dayjs.extend(utc);

  const handleConfirmBooking = async () => {
    if (!selectedExpert || !selectedTime || !selectedSlotId) {
      message.warning("Vui lòng chọn chuyên viên, thời gian và slot!");
      return;
    }

    if (!user || !user.accountId) {
      message.error("Lỗi: Không tìm thấy thông tin tài khoản!");
      console.error("User object is missing:", user);
      return;
    }

    if (!customers || customers.length === 0) {
      message.error("Lỗi: Danh sách khách hàng trống hoặc chưa tải xong!");
      console.error("Customers not loaded or empty:", customers);
      return;
    }

    const matchedCustomer = customers.find(
      (c) => Number(c.accountId) === Number(user.accountId)
    );

    if (!matchedCustomer) {
      message.error("Lỗi: Không tìm thấy khách hàng phù hợp!");
      console.error("No matching customer for accountId:", user.accountId);
      return;
    }

    if (!selectedSlotId) {
      message.error("Lỗi: Không tìm thấy slot đã chọn!");
      console.error("Missing slotId:", selectedSlotId);
      return;
    }

    const bookingData: CreateBookingDto = {
      customerId: matchedCustomer.customerId,
      location: "hcm",
      amount: amount,
      serviceId: serviceId,
      skintherapistId: selectedExpert,
      status: "",
      slotId: selectedSlotId,
    };

    createBooking(bookingData, {
      onSuccess: () => {
        navigate(PagePath.COMPLETE_RESULT);
      },
      onError: () => {
        message.error("Đặt lịch thất bại, vui lòng thử lại!");
      },
    });
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
                            <Col
                              key={`${expert.skintherapistId}-${slotId}`}
                              xs={8}
                              sm={8}
                              md={8}
                            >
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
