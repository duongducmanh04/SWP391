import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RatingDto } from "../../services/dto/rating.dto";

export const useGetRatingByCustomerId = (customerId?: number) => {
  return useQuery<RatingDto[]>({
    queryKey: ["ratings", customerId],
    queryFn: async () => {
      if (!customerId) return [];

      const response = await axios.get(
        `https://skincareservicebooking.onrender.com/api/Rating/customer/${customerId}`,
        {
          headers: { Accept: "application/json" }, // Đảm bảo API trả JSON
        }
      );

      console.log("📥 Nhận dữ liệu rating từ API:", response.data); // Debug log

      // Đảm bảo luôn có feedback, nếu null thì trả về chuỗi rỗng
      return response.data.map((rating: RatingDto) => ({
        ...rating,
        feedback: rating.feedback ?? "",
      }));
    },
    enabled: !!customerId, // Chỉ gọi API khi có customerId
  });
};
