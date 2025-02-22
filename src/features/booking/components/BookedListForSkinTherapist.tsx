import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  message,
  Badge,
  Modal,
} from "antd";
import { useBookings } from "../hooks/useGetBooked";
import { useBookingStore } from "../hooks/useBookedStore";
import { useFinishedBooking } from "../hooks/useFinishedBooking";
import dayjs from "dayjs";
import { Status } from "../../../enums/status-booking";

const { Title, Text } = Typography;

const BookingListForSkinTherapist = () => {
  const {
    data: checkInData,
    isLoading: isLoadingCheckIn,
    error: errorCheckIn,
    refetch: refetchCheckIn,
  } = useBookings(Status.CHECK_IN);

  const { setBookings } = useBookingStore();
  const { mutate: updateFinished } = useFinishedBooking();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (checkInData && !isLoadingCheckIn && !errorCheckIn) {
      setBookings(checkInData);
    }
  }, [checkInData, isLoadingCheckIn, errorCheckIn, setBookings]);

  const showConfirmModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBookingId(null);
  };

  const handleConfirmFinish = () => {
    if (selectedBookingId !== null) {
      updateFinished(
        { BookingId: selectedBookingId },
        {
          onSuccess: () => {
            message.success("Khách hàng đã sử dụng dịch vụ hoàn thành!");
            refetchCheckIn();
            setIsModalVisible(false);
          },
          onError: () => {
            message.error(
              "Hoàn thành sử dụng dịch vụ thất bại, vui lòng thử lại!"
            );
          },
        }
      );
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {checkInData?.map((booking) => (
          <Col span={8} key={booking.bookingId}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <Badge status="warning" text="Check In" />
              <Title level={4}>{booking.customerId}</Title>
              <Text>Dịch vụ: {booking.serviceName}</Text>
              <br />
              <Text>Thời gian: {dayjs(booking.date).format("DD/MM/YYYY")}</Text>
              <Row justify="space-between" style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={() => showConfirmModal(booking.bookingId)}
                >
                  Hoàn thành
                </Button>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Xác nhận hoàn thành"
        visible={isModalVisible}
        onOk={handleConfirmFinish}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có xác nhận hoàn thành dịch vụ không?</p>
      </Modal>
    </>
  );
};

export default BookingListForSkinTherapist;
