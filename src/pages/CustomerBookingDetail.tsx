import { useLocation } from "react-router-dom";
import { Card, Spin, Alert, Button, message, Modal } from "antd";
import { useBookingById } from "../features/booking/hooks/useGetBookingId";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import StatusTag from "../components/TagStatus";

const API_BASE_URL =
  "http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/Booking";

const CustomerBookingDetail = () => {
  const location = useLocation();
  const { bookingId } = location.state || {};
  const queryClient = useQueryClient();

  console.log("🔍 Booking ID từ URL:", bookingId);
  const validBookingId = bookingId ? String(bookingId) : "";

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBookingById(validBookingId);

  // Mutation để hủy đặt lịch
  const cancelBookingMutation = useMutation({
    mutationFn: async () => {
      if (!validBookingId) {
        throw new Error("Booking ID không hợp lệ");
      }

      const cancelUrl = `${API_BASE_URL}/cancelled/${validBookingId}`;
      console.log("🔄 Gửi request hủy booking:", cancelUrl);

      try {
        const response = await axios.put(cancelUrl);
        console.log("✅ Phản hồi từ server:", response.data);
        return response.data;
      } catch (err) {
        console.error("❌ Lỗi khi hủy booking:", err);
        throw err;
      }
    },
    onSuccess: () => {
      message.success("✅ Đã hủy đặt lịch thành công!");
      queryClient.invalidateQueries({
        queryKey: ["getBookingById", validBookingId],
      }); // Cập nhật lại dữ liệu mà không cần chuyển trang
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      console.error(
        "❌ Hủy thất bại:",
        axiosError.response?.data || axiosError.message
      );
      message.error(
        `❌ Hủy thất bại: ${axiosError.response?.data || axiosError.message}`
      );
    },
  });

  if (!validBookingId) {
    return (
      <div
        style={{ padding: "24px", background: "#f5f1eb", minHeight: "100vh" }}
      >
        <Card
          title="Chi tiết đặt lịch"
          bordered={false}
          style={{ maxWidth: 600, margin: "auto" }}
        >
          <Alert message="❌ Lỗi: Booking ID không hợp lệ!" type="error" />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "#f5f1eb", minHeight: "100vh" }}>
      <Card
        title="Chi tiết đặt lịch"
        bordered={false}
        style={{ maxWidth: 600, margin: "auto" }}
      >
        {isLoading ? (
          <Spin tip="🔄 Đang tải chi tiết đặt lịch..." />
        ) : isError ? (
          <Alert
            message={`❌ Lỗi: ${error?.message || "Không thể tải dữ liệu"}`}
            type="error"
          />
        ) : booking ? (
          <>
            <p>
              <strong>Mã đặt lịch:</strong> {booking.bookingId}
            </p>
            <p>
              <strong>Dịch vụ:</strong> {booking.serviceName}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {dayjs(booking.date).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Trạng thái:</strong> <StatusTag status={booking.status} />
            </p>
            <p>
              <strong>Địa điểm:</strong> {booking.location}
            </p>
            <p>
              <strong>Nhân viên:</strong> {booking.skintherapistName}
            </p>
            <p>
              <strong>Giá tiền:</strong> {booking.amount.toLocaleString()} VND
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {dayjs(booking.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Ngày cập nhật:</strong>{" "}
              {dayjs(booking.updateAt).format("DD/MM/YYYY HH:mm")}
            </p>

            {/* Nút Hủy Đặt Lịch */}
            {booking.status !== "Cancelled" && (
              <Button
                type="primary"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: "Bạn có chắc chắn muốn hủy đặt lịch?",
                    content: "Hành động này không thể hoàn tác!",
                    okText: "Hủy lịch",
                    cancelText: "Đóng",
                    onOk: () => cancelBookingMutation.mutate(),
                  });
                }}
                loading={cancelBookingMutation.isPending}
              >
                Hủy Đặt Lịch
              </Button>
            )}
          </>
        ) : (
          <Alert
            message="⚠️ Không tìm thấy thông tin đặt lịch"
            type="warning"
          />
        )}
      </Card>
    </div>
  );
};

export default CustomerBookingDetail;
