import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const RATING_API_URL = "https://localhost:7071/api/Rating";

interface Rating {
  ratingId: number;
  customerId: number;
  serviceId: number;
  stars: number;
  createAt: string;
}

// 🟢 Lấy tất cả đánh giá
const fetchAllRatings = async (): Promise<Rating[]> => {
  const response = await axios.get<Rating[]>(RATING_API_URL);
  return response.data;
};

// 🔍 Lấy rating theo customerId và serviceId
const fetchRatingById = async (
  customerId: number,
  serviceId: number
): Promise<Rating | null> => {
  try {
    const response = await axios.get<Rating>(
      `${RATING_API_URL}/${customerId}/${serviceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá:", error);
    return null;
  }
};

export const useRatings = () => {
  return useQuery<Rating[], Error>({
    queryKey: ["ratings"],
    queryFn: fetchAllRatings,
  });
};

export const useRatingById = (customerId: number, serviceId: number) => {
  return useQuery<Rating | null, Error>({
    queryKey: ["rating", customerId, serviceId],
    queryFn: () => fetchRatingById(customerId, serviceId),
    enabled: !!customerId && !!serviceId, // Chỉ fetch khi có đủ ID
  });
};
