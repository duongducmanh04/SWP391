import { useLocation } from "react-router-dom";
import { Card, Spin, Alert, Rate, message, Button } from "antd";
import { useBookingById } from "../features/booking/hooks/useGetBookingId";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import StatusTag from "../components/TagStatus";
import { useState, useEffect } from "react";
import { useGetCustomerId } from "../features/user/hook/useGetCustomerId";
import { useRatingById } from "../features/user/hook/useRatingByID";
import { useSlots } from "../features/services/hooks/useGetSlot";
import { useBookingHistory } from "../features/booking/hooks/useBookingHistory";

const RATING_API_URL = "https://localhost:7071/api/Rating";
const CANCEL_API_URL =
  "http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/Booking/cancelled";

const CustomerBookingDetail = () => {
  const location = useLocation();
  const { bookingId } = location.state || {};
  const { customerId } = useGetCustomerId();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(0);

  const validBookingId = bookingId ? String(bookingId) : "";
  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBookingById(validBookingId);

  const validCustomerId = customerId ?? 0;
  const validServiceId = booking?.serviceId ?? 0;

  const { data: bookingHistory } = useBookingHistory();

  const { data: ratingData, isLoading: isFetchingRating } = useRatingById(
    validCustomerId,
    validServiceId
  );

  useEffect(() => {
    if (ratingData?.stars !== undefined && ratingData.stars !== rating) {
      setRating(ratingData.stars);
    }
  }, [ratingData?.stars]);

  const ratingMutation = useMutation({
    mutationFn: async (value: number) => {
      return await axios.post(RATING_API_URL, {
        customerId: validCustomerId,
        stars: value,
        serviceId: validServiceId,
      });
    },
    onSuccess: (_, value) => {
      message.success("Cảm ơn bạn đã đánh giá!");
      queryClient.invalidateQueries([
        "rating",
        validCustomerId,
        validServiceId,
      ]);
      setRating(value);
    },
    onError: () => {
      message.error("❌ Lỗi khi gửi đánh giá, vui lòng thử lại!");
    },
  });

  const handleRatingChange = (value: number) => {
    ratingMutation.mutate(value);
  };

  const { data: slots } = useSlots();
  const slotTime =
    slots?.find((slot) => slot.bookingId === booking?.bookingId)?.time ||
    "Chưa có thông tin";

  const therapistName =
    bookingHistory?.find((b) => b.bookingId === booking?.bookingId)
      ?.skintherapistName || "Chưa cập nhật";

  const cancelBookingMutation = useMutation({
    mutationFn: async () => {
      await axios.put(`${CANCEL_API_URL}/${booking?.bookingId}`);
    },
    onSuccess: () => {
      message.success("Hủy đặt lịch thành công!");
      queryClient.invalidateQueries(["booking", validBookingId]);
    },
    onError: () => {
      message.error("❌ Lỗi khi hủy đặt lịch, vui lòng thử lại!");
    },
  });

  const handleCancelBooking = () => {
    cancelBookingMutation.mutate();
  };

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
              <strong>Nhân viên:</strong> {therapistName}
            </p>
            <p>
              <strong>Giá tiền:</strong> {booking.amount.toLocaleString()} VND
            </p>
            <p>
              <strong>Thời gian slot:</strong> {slotTime}
            </p>

            {booking.status === "Completed" && (
              <div style={{ marginTop: "16px" }}>
                <p>
                  <strong>Đánh giá dịch vụ:</strong>
                </p>
                {isFetchingRating ? (
                  <Spin tip="🔄 Đang tải đánh giá..." />
                ) : (
                  <Rate value={rating} onChange={handleRatingChange} />
                )}
              </div>
            )}

            {booking.status === "Booked" && (
              <div style={{ marginTop: "16px" }}>
                <Button
                  type="primary"
                  danger
                  loading={cancelBookingMutation.isLoading}
                  onClick={handleCancelBooking}
                >
                  Hủy đặt lịch
                </Button>
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
