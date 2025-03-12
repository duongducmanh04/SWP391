import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ServiceDto } from "../../services/dto/get-service.dto";

const API_SERVICE_URL =
  "https://localhost:7071/api/service/getServiceBySkintherapistId";

export const useServicesByTherapistId = (skintherapistId: string) => {
  return useQuery<ServiceDto[], Error>({
    queryKey: ["getServicesByTherapistId", skintherapistId],
    queryFn: async () => {
      const response = await axios.get<ServiceDto[]>(
        `${API_SERVICE_URL}/${skintherapistId}`
      );
      return response.data; // Trả về danh sách dịch vụ lấy được từ API
    },
    enabled: !!skintherapistId,
  });
};
