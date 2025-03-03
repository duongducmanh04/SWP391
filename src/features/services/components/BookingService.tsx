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
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useBookedSlot } from "../hooks/useGetBookedSlot";
import { useTherapists } from "../../skin_therapist/hooks/useGetTherapist";
import { useBookingss } from "../../booking/hooks/useGetBooking";
import { useCreateBooking } from "../../booking/hooks/useCreateBooking";
import useAuthStore from "../../authentication/hooks/useAuthStore";

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
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [slots] = useState<string[]>(generateSlots());
  const location = useLocation();
  const { amount, serviceName } = location.state || {};
  const { mutate: createBooking } = useCreateBooking();
  const { user } = useAuthStore();
  const { data: therapists } = useTherapists();
  const { data: bookings } = useBookingss();
  const { data: bookedSlots } = useBookedSlot();

  useEffect(() => {
    setSelectedDate(today);
  }, [today]);

  const getBookedSlotsForDate = (
    date: string,
    therapistId: number
  ): string[] => {
    if (
      !bookedSlots ||
      !bookings ||
      bookedSlots.length === 0 ||
      bookings.length === 0
    ) {
      return [];
    }
    const bookedTimes = bookedSlots
      .filter((slot) => {
        const booking = bookings.find((b) => b.bookingId === slot.bookingId);

        if (!booking) return false;

        // const normalizedBookingDate = booking.date.split("T")[0];
        const isBooked =
          // normalizedBookingDate === date &&
          slot.status === "Booked" && booking.skintherapistId === therapistId;

        if (isBooked) {
        }

        return isBooked;
      })
      .map((slot) => dayjs(slot.time, ["h:mm A", "HH:mm"]).format("HH:mm"));

    return bookedTimes;
  };

  const getMorningAndAfternoonRange = (date: string, therapistId: number) => {
    const bookedSlotsForDate = getBookedSlotsForDate(date, therapistId);

    const availableSlots = slots.filter(
      (slot) => !bookedSlotsForDate.includes(slot)
    );

    const morningSlots = availableSlots.filter(
      (slot) => dayjs(slot, "HH:mm").hour() < 12
    );
    const morningRange =
      morningSlots.length > 0
        ? `${morningSlots[0]} - ${morningSlots[morningSlots.length - 1]}`
        : "Không có";

    const afternoonSlots = availableSlots.filter(
      (slot) => dayjs(slot, "HH:mm").hour() >= 13
    );
    const afternoonRange =
      afternoonSlots.length > 0
        ? `${afternoonSlots[0]} - ${afternoonSlots[afternoonSlots.length - 1]}`
        : "Không có";

    return { morningRange, afternoonRange };
  };

  const dateCellRender = (value: Dayjs) => {
    const date = value.format("YYYY-MM-DD");

    let morningAvailable = true;
    let afternoonAvailable = true;

    if (selectedExpert) {
      const therapistAvailability = getMorningAndAfternoonRange(
        date,
        selectedExpert
      );
      morningAvailable = therapistAvailability.morningRange !== "Không có";
      afternoonAvailable = therapistAvailability.afternoonRange !== "Không có";
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          paddingLeft: "5px",
        }}
      >
        {morningAvailable && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <Badge color="#52c41a" />
            <span style={{ marginLeft: "6px", color: "black" }}>Sáng</span>
          </div>
        )}
        {afternoonAvailable && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Badge color="#52c41a" />
            <span style={{ marginLeft: "6px", color: "black" }}>Chiều</span>
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

  // const handleConfirmBooking = async () => {
  //   if (!selectedDate || !selectedExpert || !selectedTime) {
  //     message.warning("Vui lòng chọn đầy đủ thông tin trước khi đặt lịch!");
  //     return;
  //   }

  //   const bookingData = {
  //     customerId: user?.accountId ?? 0,
  //     location: "New York",
  //     date: new Date(selectedDate),
  //     amount: amount ?? 0,
  //     skintherapistId: selectedExpert,
  //     serviceName: serviceName ?? "",
  //   };

  //   console.log("Data create booking:", bookingData);

  //   try {
  //     createBooking(bookingData);
  //     message.success("Đặt lịch thành công!");
  //   } catch (err) {
  //     console.error("Lỗi khi đặt lịch:", err);
  //     message.error("Đặt lịch thất bại, vui lòng thử lại!");
  //   }
  // };

  const handleConfirmBooking = async () => {
    if (
      !selectedDate ||
      !selectedExpert ||
      !selectedTime ||
      !amount ||
      !serviceName
    ) {
      message.warning("Vui lòng chọn đầy đủ thông tin trước khi đặt lịch!");
      return;
    }

    const customerId = user?.accountId;

    if (!customerId) {
      message.error(
        "Lỗi: Không thể xác định khách hàng. Vui lòng đăng nhập lại!"
      );
      return;
    }

    const bookingData = {
      customerId: customerId,
      location: "New York",
      date: new Date(selectedDate),
      amount: Number(amount),
      skintherapistId: Number(selectedExpert),
      serviceName: serviceName,
    };

    // const customerId = user.accountId;
    // if (typeof customerId !== "number" || isNaN(customerId)) {
    //   console.error(
    //     "Invalid customer ID:",
    //     customerId,
    //     "Type:",
    //     typeof customerId
    //   );
    //   message.error(
    //     "Lỗi: Không thể xác định khách hàng. Vui lòng đăng nhập lại!"
    //   );
    //   return;
    // }

    // console.log("User from auth store:", user);
    // console.log("Customer ID:", customerId, "Type:", typeof customerId);

    // const bookingData = {
    //   customerId: Number(customerId),
    //   location: "New York",
    //   date: new Date(selectedDate),
    //   amount: Number(amount),
    //   skintherapistId: Number(selectedExpert),
    //   serviceName: serviceName,
    // };

    console.log("Data booking create:", bookingData);

    try {
      await createBooking(bookingData, {
        onSuccess: () => {
          message.success("Đặt lịch thành công!");
        },
        onError: (error) => {
          console.error("Lỗi khi đặt lịch:", error);
          message.error("Đặt lịch thất bại, vui lòng thử lại!");
        },
      });
    } catch (err) {
      console.error("Bắt lỗi ngoài cùng:", err);
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
              cellRender={(value) => {
                const date = value.format("YYYY-MM-DD");
                const isPast = value.isBefore(dayjs(), "day");

                return isPast ? null : dateCellRender(value);
              }}
              disabledDate={(current) => current.isBefore(dayjs(), "day")}
              onSelect={(value) => {
                const formattedDate = value.format("YYYY-MM-DD");
                setSelectedDate(formattedDate);
              }}
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
                        e.currentTarget.style.boxShadow =
                          "0 6px 15px rgba(0,0,0,0.15)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 10px rgba(0,0,0,0.1)";
                      }}
                    >
                      <Row justify="center" align="middle">
                        <Col span={24} style={{ textAlign: "center" }}>
                          <Title
                            level={4}
                            style={{ marginTop: "10px", color: "#3A5A40" }}
                          >
                            {expert.name}
                          </Title>
                          <Text style={{ color: "#6B705C" }}>
                            {expert.expertise}
                          </Text>
                        </Col>
                      </Row>

                      <Row
                        gutter={[8, 8]}
                        justify="center"
                        style={{ marginTop: "10px" }}
                      >
                        {slots
                          .filter((time) => {
                            const hour = dayjs(time, "HH:mm").hour();
                            return hour < 12 || hour >= 13;
                          })
                          .map((time) => {
                            const isBooked = getBookedSlotsForDate(
                              selectedDate,
                              expert.skintherapistId
                            ).includes(time);

                            return (
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
                                      time
                                    )
                                  }
                                  disabled={isBooked}
                                  style={{
                                    width: "100%",
                                    borderRadius: "20px",
                                    fontSize: "14px",
                                    padding: "8px 16px",
                                    transition: "all 0.3s ease-in-out",
                                    backgroundColor: isBooked
                                      ? "#ff4d4f"
                                      : "white",
                                    color: isBooked ? "white" : "#3A5A40",
                                    border: isBooked
                                      ? "1px solid #ff7875"
                                      : "1px solid #A7C957",
                                    cursor: isBooked
                                      ? "not-allowed"
                                      : "pointer",
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
                    onClick={() => {
                      message.success("Đặt lịch thành công");
                    }}
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
