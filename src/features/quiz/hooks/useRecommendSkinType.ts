import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface RecommendSkintypeResponse {
  recommendation: string;
}

const recommendSkintype = async (
  id: number
): Promise<RecommendSkintypeResponse> => {
  try {
    const response = await axios.get(
      `http://localhost:7071/recommendSkintype/${id}`,
      {
        headers: { Accept: "text/plain" },
      }
    );

    console.log("✅ Dữ liệu nhận từ API (recommendSkintype):", response.data);
    return { recommendation: response.data };
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API recommendSkintype:", error);
    throw new Error(
      error.response?.data?.message || "Không thể lấy loại da đề xuất"
    );
  }
};

export const useRecommendSkintype = (id: number) => {
  return useQuery<RecommendSkintypeResponse, Error>({
    queryKey: ["recommendSkintype", id],
    queryFn: () => recommendSkintype(id),
    enabled: !!id, // Chỉ gọi API nếu id hợp lệ
  });
};
