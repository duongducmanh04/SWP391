import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RatingDto } from "../dto/rating.dto";

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRating: RatingDto) => {
      // ✅ Chuẩn hóa dữ liệu trước khi gửi
      const payload: Partial<RatingDto> = {
        ...newRating,
        feedback: newRating.feedback?.trim() || "",
        bookingId: newRating.bookingId, // 🔥 Đảm bảo gửi bookingId
      };

      console.log("📤 Gửi request lên API:", payload);

      try {
        const response = await axios.post(
          `https://skincareservicebooking.onrender.com/api/Rating`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("✅ API Response:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Lỗi API:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log("✅ Đánh giá đã được lưu thành công!");

      // 🚀 Fetch lại dữ liệu mới nhất
      queryClient.invalidateQueries({
        queryKey: [
          "latestRating",
          variables.customerId,
          variables.serviceId,
          variables.bookingId, // ✅ Thêm bookingId để đảm bảo fetch chính xác
        ],
      });
    },
    onError: (error) => {
      console.error("❌ Lỗi khi gửi đánh giá:", error);
    },
  });
};
