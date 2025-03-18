import { useLocation } from "react-router-dom";
import { Card, Spin, Alert, Button, message, Modal, Rate } from "antd";
import { useBookingById } from "../features/booking/hooks/useGetBookingId";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import StatusTag from "../components/TagStatus";

import { useState, useEffect } from "react";
import { useGetCustomerId } from "../features/user/hook/useGetCustomerId";
import { useRatingsByService } from "../features/user/hook/useRatingsByServiceID";
import { Status } from "../enums/status-booking";

const API_BASE_URL =
  "http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/Booking";
const RATING_API_URL = "https://localhost:7071/api/Rating";

const CustomerBookingDetail = () => {
  const location = useLocation();
  const { bookingId } = location.state || {};
  const queryClient = useQueryClient();

  const { customerId } = useGetCustomerId();
  const validBookingId = bookingId ? String(bookingId) : "";
  const validCustomerId = customerId ?? 0;

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBookingById(validBookingId);
  const validServiceId = booking?.serviceId ?? 0;

  // 🔹 Lấy danh sách rating từ API
  const { data: ratings, isLoading: isRatingsLoading } =
    useRatingsByService(validServiceId);

  // 🔹 Tìm rating của khách hàng hiện tại
  const existingRating = ratings?.find(
    (rating) => rating.customerId === validCustomerId
  );
  const [rating, setRating] = useState<number>(existingRating?.stars ?? 0);

  useEffect(() => {
    if (existingRating?.stars !== undefined) {
      setRating(existingRating.stars);
    }
  }, [existingRating]);

  // ✅ Hủy đặt lịch
  const cancelBookingMutation = useMutation({
    mutationFn: async () => {
      if (!validBookingId) {
        throw new Error("Booking ID không hợp lệ");
      }
      const cancelUrl = `${API_BASE_URL}/cancelled/${validBookingId}`;
      const response = await axios.put(cancelUrl);
      return response.data;
    },
    onSuccess: () => {
      message.success("✅ Đã hủy đặt lịch thành công!");
      queryClient.invalidateQueries({
        queryKey: ["getBookingById", validBookingId],
      });
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      message.error(
        `❌ Hủy thất bại: ${axiosError.response?.data || axiosError.message}`
      );
    },
  });

  // ✅ Đánh giá dịch vụ (POST hoặc PUT)
  const ratingMutation = useMutation({
    mutationFn: async (value: number) => {
      if (existingRating) {
        // Cập nhật đánh giá nếu đã tồn tại
        return await axios.put(`${RATING_API_URL}/${existingRating.ratingId}`, {
          customerId: validCustomerId,
          stars: value,
          serviceId: validServiceId,
        });
      } else {
        // Tạo đánh giá mới
        return await axios.post(RATING_API_URL, {
          customerId: validCustomerId,
          stars: value,
          serviceId: validServiceId,
        });
      }
    },
    onSuccess: () => {
      message.success("✅ Cảm ơn bạn đã đánh giá!");
      queryClient.invalidateQueries({
        queryKey: ["ratings", validServiceId],
      });
    },
    onError: () => {
      message.error("❌ Lỗi khi gửi đánh giá, vui lòng thử lại!");
    },
  });

  const handleRatingChange = (value: number) => {
    setRating(value);
    ratingMutation.mutate(value);
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
              <strong>Nhân viên:</strong> {booking.skintherapistName}
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
                    onOk: () => cancelBookingMutation.mutate(),
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
                {isRatingsLoading ? (
                  <Spin tip="🔄 Đang tải đánh giá..." />
                ) : (
                  <Rate value={rating} onChange={handleRatingChange} />
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
