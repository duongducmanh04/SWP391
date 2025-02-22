import { Card, Button, Spin, Descriptions, Tag } from "antd";
import { DollarOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useBookingById } from "../hooks/useGetBookingId";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const { data: booking, isLoading, isError } = useBookingById(bookingId || "");

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError || !booking) {
    return <div>Không tìm thấy lịch đặt</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>Chi tiết đơn hàng #{booking.bookingId}</h2>
      <Card>
        <Descriptions title="Thông tin chung" bordered column={1}>
          <Descriptions.Item label="Khách hàng">
            {booking.customerId}
          </Descriptions.Item>
          <Descriptions.Item label="Điện thoại">
            {booking.amount}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {booking.location}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đặt hàng">
            {booking.date}
          </Descriptions.Item>
          <Descriptions.Item label="Tình trạng thanh toán">
            {booking.status}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card style={{ marginTop: 20 }}>
        <p>
          <b>Trạng thái:</b>{" "}
          <Tag color="orange">
            <ExclamationCircleOutlined /> Chờ xác nhận
          </Tag>
        </p>
        <Button danger style={{ marginRight: 10 }}>
          Hủy đơn
        </Button>
        <Button type="primary">Xác nhận</Button>
        <h4 style={{ marginTop: 20 }}>Lịch sử trạng thái</h4>
        <p>🟢 {booking.date} - Chờ xác nhận</p>
      </Card>
    </div>
  );
};

export default BookingDetail;
