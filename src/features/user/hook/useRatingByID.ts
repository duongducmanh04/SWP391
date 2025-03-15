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
    staleTime: 60000, // Giữ cache 1 phút để tránh refetch quá nhiều
    refetchOnMount: "always", // Luôn cập nhật dữ liệu khi vào trang
    refetchOnWindowFocus: false, // Không refetch khi chuyển tab
  });
};

export const useRatingById = (customerId: number, serviceId: number) => {
  return useQuery<Rating | null, Error>({
    queryKey: ["rating", customerId, serviceId],
    queryFn: () => fetchRatingById(customerId, serviceId),
    enabled: !!customerId && !!serviceId, // Chỉ fetch khi có đủ ID
    staleTime: 0, // Luôn lấy dữ liệu mới từ API
    refetchOnMount: "always", // Luôn cập nhật dữ liệu khi vào trang
    refetchOnWindowFocus: false, // Không refetch khi chuyển tab
  });
};
