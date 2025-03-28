import { useLocation } from "react-router-dom";
import { Card, Spin, Alert, Button, message, Modal, Rate } from "antd";
import { useBookingById } from "../features/booking/hooks/useGetBookingId";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import StatusTag from "../components/TagStatus";
import { useState, useEffect } from "react";
import { useGetCustomerId } from "../features/user/hook/useGetCustomerId";
import { Status } from "../enums/status-booking";
import { useSlots } from "../features/services/hooks/useGetSlot";
import { SlotDto } from "../features/services/dto/slot.dto";
import { useTherapists } from "../features/skin_therapist/hooks/useGetTherapist";
import { TherapistDto } from "../features/skin_therapist/dto/get-therapist.dto";
import { useCancelledBooking } from "../features/booking/hooks/useCancelledBooking";
import { useCreateRating } from "../features/services/hooks/useCreateRating";
import { useGetRatingByCustomerId } from "../features/user/hook/useGetRatingByCustomerId"; // ✅ Import hook

const CustomerBookingDetail = () => {
  const location = useLocation();
  const { bookingId } = location.state || {};
  const queryClient = useQueryClient();
  const { data: slots } = useSlots();
  const { data: therapists } = useTherapists();
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
    useGetRatingByCustomerId(validCustomerId); // ✅ Lấy rating theo customerId
  const existingRating = ratings?.find(
    (r) => r.serviceId === booking?.serviceId
  );

  const [rating, setRating] = useState<number>(
    existingRating?.stars ??
      (Number(localStorage.getItem(`rating_${validBookingId}`)) || 0)
  );

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.stars);
      localStorage.setItem(
        `rating_${validBookingId}`,
        String(existingRating.stars)
      );
    }
  }, [existingRating]);

  const slotMap = new Map<number, SlotDto>();
  if (slots) {
    slots.forEach((slot) => slotMap.set(slot.bookingId, slot));
  }

  const therapistMap = new Map<number, TherapistDto>();
  if (therapists) {
    therapists.forEach((therapist) =>
      therapistMap.set(therapist.skintherapistId, therapist)
    );
  }

  const { mutate: cancelBooking } = useCancelledBooking();
  const { mutate: createRating } = useCreateRating();

  const handleRatingChange = (value: number) => {
    if (!booking?.serviceId) {
      message.error("❌ Không thể gửi đánh giá vì thiếu serviceId!");
      return;
    }

    setRating(value);
    localStorage.setItem(`rating_${validBookingId}`, String(value));

    createRating(
      {
        ratingId: 0,
        customerId: validCustomerId,
        stars: value,
        serviceId: booking.serviceId,
        createAt: new Date(),
        customerName: "Unknown",
        serviceName: booking.serviceName || "Unknown",
      },
      {
        onSuccess: () => {
          message.success("Cảm ơn bạn đã đánh giá!");
          queryClient.invalidateQueries({
            queryKey: ["ratings", booking?.serviceId],
          });
        },
        onError: () => {
          message.error("❌ Lỗi khi gửi đánh giá, vui lòng thử lại!");
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
