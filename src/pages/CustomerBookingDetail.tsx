import { useLocation } from "react-router-dom";
import { Card, Spin, Alert, Button, message, Modal, Rate } from "antd";
import { useBookingById } from "../features/booking/hooks/useGetBookingId";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import StatusTag from "../components/TagStatus";

import { useState } from "react";
import { useGetCustomerId } from "../features/user/hook/useGetCustomerId";
import { Status } from "../enums/status-booking";
import { useSlots } from "../features/services/hooks/useGetSlot";
import { SlotDto } from "../features/services/dto/slot.dto";
import { useTherapists } from "../features/skin_therapist/hooks/useGetTherapist";
import { TherapistDto } from "../features/skin_therapist/dto/get-therapist.dto";

const RATING_API_URL = "https://localhost:7071/api/Rating";

const CustomerBookingDetail = () => {
  const location = useLocation();
  const { bookingId } = location.state || {};
  const queryClient = useQueryClient();
  const { data: slots } = useSlots();
  const { data: therapists } = useTherapists();

  const { customerId } = useGetCustomerId();
  const [rating, setRating] = useState(0);

  const validBookingId = bookingId ? String(bookingId) : "";

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBookingById(validBookingId);

  const slotMap = new Map<number, SlotDto>();
  if (slots) {
    slots.forEach((slot) => {
      slotMap.set(slot.bookingId, slot);
    });
  }

  const therapistMap = new Map<number, TherapistDto>();
  if (therapists) {
    therapists.forEach((therapist) => {
      therapistMap.set(therapist.skintherapistId, therapist);
    });
  }

  const cancelBookingMutation = useMutation({
    mutationFn: async () => {
      if (!validBookingId) {
        throw new Error("Booking ID không hợp lệ");
      }

      const cancelUrl = `https://localhost:7071/api/Booking/cancelled/${validBookingId}`;

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

  const ratingMutation = useMutation({
    mutationFn: async (value: number) => {
      return await axios.post(RATING_API_URL, {
        customerId,
        stars: value,
        serviceId: booking?.serviceId,
      });
    },
    onSuccess: () => {
      message.success("✅ Cảm ơn bạn đã đánh giá!");
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
              <strong>Ngày đặt làm:</strong>{" "}
              {dayjs(booking.date).format("DD/MM/YYYY")}{" "}
              {slotMap.get(booking.bookingId)?.time
                ? ` - ${slotMap.get(booking.bookingId)?.time}`
                : ""}
            </p>
            <p>
              <strong>Trạng thái:</strong> <StatusTag status={booking.status} />
            </p>
            <p>
              <strong>Địa điểm:</strong> {booking.location}
            </p>
            <p>
              <strong>Nhân viên:</strong>{" "}
              {therapistMap.get(booking.skintherapistId)?.name}
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

            {booking.status == Status.COMPLETED && (
              <div style={{ marginTop: "16px" }}>
                <p>
                  <strong>Đánh giá dịch vụ:</strong>
                </p>
                <Rate value={rating} onChange={handleRatingChange} />
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
