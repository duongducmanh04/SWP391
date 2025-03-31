import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const RATING_API_URL = "https://skincareservicebooking.onrender.com/api/Rating";

interface Rating {
  ratingId: number;
  customerId: number;
  serviceId: number;
  stars: number;
  createdAt: string;
  customerName?: string;
  serviceName?: string;
  feedback?: string;
}

// 🟢 Hàm fetch rating theo ID
const fetchRatingById = async (ratingId?: number): Promise<Rating | null> => {
  if (!ratingId) return null;

  try {
    const response = await axios.get<Rating>(`${RATING_API_URL}/${ratingId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy đánh giá:", error);
    return null;
  }
};

// 🔍 Hook lấy rating theo ID
export const useRatingById = (ratingId?: number) => {
  return useQuery<Rating | null, Error>({
    queryKey: ["rating", ratingId],
    queryFn: () => fetchRatingById(ratingId),
    enabled: Boolean(ratingId),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
