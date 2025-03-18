import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const RATING_API_URL = "https://localhost:7071/api/Rating";

interface Rating {
  ratingId: number;
  customerId: number;
  serviceId: number;
  stars: number;
  createdAt: string;
}

// 🟢 Lấy tất cả đánh giá
const fetchAllRatings = async (): Promise<Rating[]> => {
  const response = await axios.get<Rating[]>(`${RATING_API_URL}/all`);
  return response.data;
};

// 🔍 Lấy rating theo customerId và serviceId
const fetchRatingById = async (
  customerId?: number,
  serviceId?: number
): Promise<number> => {
  if (!customerId || !serviceId) {
    console.warn("❌ Thiếu customerId hoặc serviceId khi fetch rating!");
    return 0;
  }

  try {
    console.log(
      `Fetching rating from: ${RATING_API_URL}/${customerId}/${serviceId}`
    );
    const response = await axios.get<Rating>(
      `${RATING_API_URL}/${customerId}/${serviceId}`
    );
    return response.data?.stars || 0;
  } catch (error) {
    console.error("❌ Lỗi khi lấy đánh giá:", error);
    return 0;
  }
};

// Hook lấy tất cả rating
export const useRatings = () => {
  return useQuery<Rating[], Error>({
    queryKey: ["ratings"],
    queryFn: fetchAllRatings,
    staleTime: 1000 * 60 * 5, // Giữ cache trong 5 phút
  });
};

// Hook lấy rating theo customerId và serviceId
export const useRatingById = (customerId?: number, serviceId?: number) => {
  return useQuery<number, Error>({
    queryKey: ["rating", customerId, serviceId],
    queryFn: () => fetchRatingById(customerId, serviceId),
    enabled: Boolean(customerId && serviceId), // Chỉ gọi API nếu có đủ dữ liệu
    staleTime: 1000 * 60 * 5, // Giữ cache trong 5 phút
  });
};
