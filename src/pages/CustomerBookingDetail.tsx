import { useLocation } from "react-router-dom";
import { Card, Spin, Alert, Button, message, Modal, Rate } from "antd";
import { useBookingById } from "../features/booking/hooks/useGetBookingId";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import StatusTag from "../components/TagStatus";
import { useState, useEffect } from "react";
import { useGetCustomerId } from "../features/user/hook/useGetCustomerId";
import { Status } from "../enums/status-booking";
import { useCancelledBooking } from "../features/booking/hooks/useCancelledBooking";
import { useCreateRating } from "../features/services/hooks/useCreateRating";
import axios from "axios";
import { RatingDto } from "../features/services/dto/rating.dto";
import { useTherapistById } from "../features/skin_therapist/hooks/useGetTherapistId";

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

  const {
    data: therapist,
    isLoading: isTherapistLoading,
    isError: isTherapistError,
  } = useTherapistById(String(booking?.skintherapistId));

  const {
    data: latestRating,
    isLoading: isLoadingRating,
    refetch: refetchRating,
  } = useQuery<RatingDto | null>({
    queryKey: ["latestRating", validCustomerId, booking?.serviceId],
    queryFn: async () => {
      if (!validCustomerId || !booking?.serviceId) return null;

      const response = await axios.get<RatingDto[]>(
        `https://skincareservicebooking.onrender.com/api/Rating/customer/${validCustomerId}`,
        { headers: { Accept: "application/json" } }
      );

      const ratingsForService = response.data.filter(
        (r) =>
          r.serviceId === booking.serviceId && r.customerId === validCustomerId
      );

      if (ratingsForService.length === 0) return null;

      return ratingsForService.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )[0];
    },
    enabled: !!validCustomerId && !!booking?.serviceId,
  });

  const [rating, setRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);

  useEffect(() => {
    if (latestRating) {
      setHasRated(true);
    } else {
      setRating(0);
      setHasRated(false);
    }
  }, [latestRating]);

  const { mutate: cancelBooking } = useCancelledBooking();
  const { mutate: createRating } = useCreateRating();

  const handleRatingSubmit = () => {
    if (!booking?.serviceId) {
      message.error("❌ Không thể gửi đánh giá vì thiếu serviceId!");
      return;
    }

    const newRating: RatingDto = {
      ratingId: Math.random(),
      customerId: validCustomerId,
      stars: rating,
      serviceId: booking.serviceId,
      bookingId: validBookingId,
      createAt: new Date(),
      customerName: "Unknown",
      serviceName: booking.serviceName || "Unknown",
      feedback: "", // ✅ Sửa lỗi kiểu dữ liệu
    };

    createRating(newRating, {
      onSuccess: () => {
        message.success("✅ Đánh giá đã được gửi!");

        queryClient.setQueryData(
          ["latestRating", validCustomerId, booking.serviceId],
          newRating
        );
        refetchRating();
        setHasRated(true);
      },
      onError: () => {
        message.error("❌ Lỗi khi gửi đánh giá!");
      },
    });
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

            <p>
              <strong>Tên chuyên viên:</strong>{" "}
              {isTherapistLoading
                ? "🔄 Đang tải..."
                : isTherapistError || !therapist
                ? "Không có thông tin"
                : therapist.name}
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

            {booking.status === Status.COMPLETED && !hasRated && (
              <div style={{ marginTop: "16px" }}>
                <p>
                  <strong>Đánh giá dịch vụ:</strong>
                </p>
                {isLoadingRating ? (
                  <Spin tip="🔄 Đang tải đánh giá..." />
                ) : (
                  <>
                    <Rate value={rating} onChange={setRating} />
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
