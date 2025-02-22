import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ServiceDto } from "../dto/get-service.dto";

const API_BASE_URL =
  "http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/service/getServiceById";

export const useServiceById = (serviceId: string) => {
  return useQuery<ServiceDto, Error>({
    queryKey: ["getServiceById", serviceId],
    queryFn: async () => {
      const response = await axios.get<ServiceDto>(
        `${API_BASE_URL}/${serviceId}`
      );
      return response.data;
    },
    enabled: !!serviceId,
  });
};
