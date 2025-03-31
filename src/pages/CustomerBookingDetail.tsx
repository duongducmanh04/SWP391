import { useLocation } from "react-router-dom";
import { Card, Spin, Alert, Button, message, Modal, Rate, Input } from "antd";
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

  // 📥 API lấy rating mới nhất dựa trên customerId và serviceId
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

      console.log("📥 Nhận dữ liệu rating từ API:", response.data);

      // 🎯 Lọc rating theo `customerId`, `serviceId`
      const ratingsForService = response.data.filter(
        (r) =>
          r.serviceId === booking.serviceId && r.customerId === validCustomerId
      );

      if (ratingsForService.length === 0) return null;

      // 🏆 Lấy rating mới nhất dựa trên `createAt`
      return ratingsForService.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )[0];
    },
    enabled: !!validCustomerId && !!booking?.serviceId,
  });

  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [hasRated, setHasRated] = useState<boolean>(false);

  useEffect(() => {
    if (latestRating) {
      setRating(latestRating.stars);
      setFeedback(latestRating.feedback || "");
      setHasRated(true);
    } else {
      setRating(0);
      setFeedback("");
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
      ratingId: Math.random(), // 🆕 Tạo ID tạm thời
      customerId: validCustomerId,
      stars: rating,
      feedback: feedback.trim(),
      serviceId: booking.serviceId,
      bookingId: validBookingId, // ✅ Lưu vào cache dù API chưa hỗ trợ
      createAt: new Date(),
      customerName: "Unknown",
      serviceName: booking.serviceName || "Unknown",
    };

    createRating(newRating, {
      onSuccess: () => {
        message.success("✅ Đánh giá đã được gửi!");

        // 🆕 Lưu ngay vào cache để hiển thị tức thì
        queryClient.setQueryData(
          ["latestRating", validCustomerId, booking.serviceId],
          newRating
        );

        // 🚀 Refetch API để đảm bảo dữ liệu chính xác
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
                ) : hasRated ? (
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
