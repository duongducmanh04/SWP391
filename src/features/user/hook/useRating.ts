import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const RATING_API_URL = "https://skincareservicebooking.onrender.com/api/Rating";

interface Rating {
  ratingId: number;
  customerId: number;
  serviceId: number;
  stars: number;
  createdAt: string;
}

// 🟢 Hàm fetch tất cả đánh giá
const fetchAllRatings = async (): Promise<Rating[]> => {
  const response = await axios.get<Rating[]>(`${RATING_API_URL}/all`);
  return response.data;
};

// Hook lấy tất cả rating
export const useAllRatings = () => {
  return useQuery<Rating[], Error>({
    queryKey: ["allRatings"], // Đổi tên queryKey cho rõ ràng
    queryFn: fetchAllRatings,
    staleTime: 1000 * 60 * 5, // Giữ cache trong 5 phút
  });
};
