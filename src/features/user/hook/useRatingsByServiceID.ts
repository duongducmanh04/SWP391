import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const RATING_API_URL =
  "https://skincareservicebooking.onrender.com/api/Rating/service";

interface Rating {
  ratingId: number;
  customerId: number;
  serviceId: number;
  stars: number;
  createdAt: string;
  customerName?: string;
  serviceName?: string;
}

// 🟢 Hàm fetch rating theo serviceId
const fetchRatingsByService = async (serviceId?: number): Promise<Rating[]> => {
  if (!serviceId) return [];

  try {
    const response = await axios.get<Rating[]>(
      `${RATING_API_URL}/${serviceId}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đánh giá:", error);
    return [];
  }
};

// 🔍 Hook lấy danh sách rating theo serviceId
export const useRatingsByService = (serviceId?: number) => {
  return useQuery<Rating[], Error>({
    queryKey: ["ratings", serviceId],
    queryFn: () => fetchRatingsByService(serviceId),
    enabled: Boolean(serviceId),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
