import { useEffect } from "react";
import { Card, Tabs, Button, Typography, Row, Col, Badge, Space } from "antd";
import { useBookings } from "../hooks/useGetBooked";
import { useBookingStore } from "../hooks/useBookedStore";
import { useCheckInBooking } from "../hooks/useCheckInBooking";
import { useCompletedBooking } from "../hooks/useCompletedBooking";
import { useCancelledBooking } from "../hooks/useCancelledBooking";
import { useDeniedBooking } from "../hooks/useDeniedBooking";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PayCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Status } from "../../../enums/status-booking";
import { showActionConfirmModal } from "../../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const BookingListForStaff = () => {
  const {
    data: bookedData,
    isLoading: isLoadingBooked,
    error: errorBooked,
    refetch: refetchBooked,
  } = useBookings(Status.BOOKED);

  const {
    data: finishedData,
    isLoading: isLoadingFinished,
    error: errorFinished,
    refetch: refetchFinished,
  } = useBookings(Status.FINISHED);

  const { setBookings } = useBookingStore();
  const { mutate: updateCheckIn } = useCheckInBooking();
  const { mutate: updateCompleted } = useCompletedBooking();
  const { mutate: updateCancelled } = useCancelledBooking();
  const { mutate: updateDenied } = useDeniedBooking();
  const navigate = useNavigate();

  const handleUpdateService = (bookingId: number) => {
    navigate("/Staff/UpdateBooking");
  };

  useEffect(() => {
    if (bookedData && !isLoadingBooked && !errorBooked) {
      setBookings(bookedData);
    }
    if (finishedData && !isLoadingFinished && !errorFinished) {
      setBookings(finishedData);
    }
  }, [
    bookedData,
    isLoadingBooked,
    errorBooked,
    setBookings,
    finishedData,
    isLoadingFinished,
    errorFinished,
  ]);

  const handleConfirmAction = async (
    action: "checkin" | "checkout" | "cancel" | "deny",
    bookingId: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const actionFunctions = {
        checkin: updateCheckIn,
        checkout: updateCompleted,
        cancel: updateCancelled,
        deny: updateDenied,
      };

      actionFunctions[action](
        { BookingId: bookingId },
        {
          onSuccess: () => {
            if (action === "checkin" || action === "cancel") {
              refetchBooked();
            } else {
              refetchFinished();
            }
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Check-in" key="1">
        <Row gutter={[16, 16]}>
          {bookedData?.map((booking) => (
            <Col span={8} key={booking.bookingId}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "16px",
                }}
              >
                <Badge status="processing" text="Booked" />
                <Title level={4}>{booking.customerId}</Title>
                <Text strong>Dịch vụ: </Text>
                <Text>{booking.serviceName}</Text>
                <br />
                <Text strong>Thời gian: </Text>
                <Text>{dayjs(booking.date).format("DD/MM/YYYY")}</Text>

                <Space
                  style={{
                    width: "100%",
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() =>
                      showActionConfirmModal({
                        action: "checkin",
                        bookingId: booking.bookingId,
                        onConfirm: (bookingId) =>
                          handleConfirmAction("checkin", bookingId),
                      })
                    }
                  >
                    Check-in
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleUpdateService(booking.bookingId)}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() =>
                      showActionConfirmModal({
                        action: "cancel",
                        bookingId: booking.bookingId,
                        onConfirm: (bookingId) =>
                          handleConfirmAction("cancel", bookingId),
                      })
                    }
                  >
                    Hủy
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </TabPane>
      <TabPane tab="Check-out" key="2">
        <Row gutter={[16, 16]}>
          {finishedData?.map((booking) => (
            <Col span={8} key={booking.bookingId}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "16px",
                }}
              >
                <Badge status="success" text="Finished" />
                <Title level={4}>{booking.customerId}</Title>
                <Text strong>Dịch vụ: </Text>
                <Text>{booking.serviceName}</Text>
                <br />
                <Text strong>Thời gian: </Text>
                <Text>{dayjs(booking.date).format("DD/MM/YYYY")}</Text>

                <Space
                  style={{
                    width: "100%",
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    type="default"
                    onClick={() =>
                      showActionConfirmModal({
                        action: "checkout",
                        bookingId: booking.bookingId,
                        onConfirm: (bookingId) =>
                          handleConfirmAction("checkout", bookingId),
                      })
                    }
                  >
                    Check-out
                  </Button>
                  <Button
                    danger
                    icon={<PayCircleOutlined />}
                    onClick={() =>
                      showActionConfirmModal({
                        action: "deny",
                        bookingId: booking.bookingId,
                        onConfirm: (bookingId) =>
                          handleConfirmAction("deny", bookingId),
                      })
                    }
                  >
                    Không thanh toán
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </TabPane>
    </Tabs>
  );
};

export default BookingListForStaff;
