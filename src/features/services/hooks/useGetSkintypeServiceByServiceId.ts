import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SkintypeServiceDto } from "../dto/skintype-service.dto";

export const useSkintypeServiceByServiceId = (serviceId: string) => {
  return useQuery<SkintypeServiceDto[], Error>({
    // 🛠 Đổi từ object sang array
    queryKey: ["getSkintypeServiceByServiceId", serviceId],
    queryFn: async () => {
      const response = await axios.get<SkintypeServiceDto[]>( // 🛠 Đổi kiểu dữ liệu trả về thành array
        `https://skincareservicebooking.onrender.com/getSkintypeServiceByServiceId/${serviceId}`
      );
      return response.data;
    },
    enabled: !!serviceId,
  });
};
