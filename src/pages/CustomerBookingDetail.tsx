import { useLocation } from "react-router-dom";
import { Card, Spin, Alert, Button, message, Modal, Rate, Input } from "antd";
import { useBookingById } from "../features/booking/hooks/useGetBookingId";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import StatusTag from "../components/TagStatus";
import { useState, useEffect } from "react";
import { useGetCustomerId } from "../features/user/hook/useGetCustomerId";
import { Status } from "../enums/status-booking";
import { useCancelledBooking } from "../features/booking/hooks/useCancelledBooking";
import { useCreateRating } from "../features/services/hooks/useCreateRating";
import { useGetRatingByCustomerId } from "../features/user/hook/useGetRatingByCustomerId";

const CustomerBookingDetail = () => {
  const location = useLocation();
  const { bookingId } = location.state || {};
  const queryClient = useQueryClient();
  const { customerId } = useGetCustomerId();

  const validBookingId = bookingId ? Number(bookingId) : 0;
  const validCustomerId = customerId ?? 0;

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBookingById(String(validBookingId));

  const { data: ratings, isLoading: isLoadingRating } =
    useGetRatingByCustomerId(validCustomerId);

  const existingRating = ratings?.find(
    (r) => r.serviceId === booking?.serviceId
  );

  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.stars);
      setFeedback(existingRating.feedback || "");
    }
  }, [existingRating]);

  const { mutate: cancelBooking } = useCancelledBooking();
  const { mutate: createRating } = useCreateRating();

  const handleRatingSubmit = () => {
    if (!booking?.serviceId) {
      message.error("❌ Không thể gửi đánh giá vì thiếu serviceId!");
      return;
    }

    createRating(
      {
        ratingId: undefined,
        customerId: validCustomerId,
        stars: rating,
        feedback: feedback.trim(),
        serviceId: booking.serviceId,
        createAt: new Date(),
        customerName: "Unknown",
        serviceName: booking.serviceName || "Unknown",
      },
      {
        onSuccess: () => {
          message.success("✅ Đánh giá đã được gửi!");
          queryClient.invalidateQueries({
            queryKey: ["ratings", validCustomerId],
          });
        },
        onError: () => {
          message.error("❌ Lỗi khi gửi đánh giá!");
        },
      }
    );
  };

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
              <strong>Ngày đặt làm:</strong>{" "}
              {dayjs(booking.date).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Trạng thái:</strong> <StatusTag status={booking.status} />
            </p>
            <p>
              <strong>Địa điểm:</strong> {booking.location}
            </p>
            <p>
              <strong>Giá tiền:</strong> {booking.amount.toLocaleString()} VND
            </p>

            {booking.status === "Booked" && (
              <Button
                type="primary"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: "Bạn có chắc chắn muốn hủy đặt lịch?",
                    content: "Hành động này không thể hoàn tác!",
                    okText: "Hủy lịch",
                    cancelText: "Đóng",
                    onOk: () => cancelBooking({ BookingId: validBookingId }),
                  });
                }}
              >
                Hủy Đặt Lịch
              </Button>
            )}

            {booking.status === Status.COMPLETED && (
              <div style={{ marginTop: "16px" }}>
                <p>
                  <strong>Đánh giá dịch vụ:</strong>
                </p>
                {isLoadingRating ? (
                  <Spin tip="🔄 Đang tải đánh giá..." />
                ) : existingRating ? (
                  // 🔥 Nếu đã có đánh giá, chỉ hiển thị ở chế độ readonly
                  <>
                    <Rate value={rating} disabled />
                    <Input.TextArea
                      value={feedback}
                      rows={4}
                      style={{ marginTop: 10 }}
                      readOnly
                    />
                  </>
                ) : (
                  // 🔥 Nếu chưa có đánh giá, cho phép tạo mới
                  <>
                    <Rate value={rating} onChange={setRating} />
                    <Input.TextArea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Nhập đánh giá của bạn..."
                      rows={4}
                      style={{ marginTop: 10 }}
                    />
                    <Button
                      type="primary"
                      onClick={handleRatingSubmit}
                      style={{ marginTop: 10 }}
                    >
                      Gửi đánh giá
                    </Button>
                  </>
                )}
              </div>
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
