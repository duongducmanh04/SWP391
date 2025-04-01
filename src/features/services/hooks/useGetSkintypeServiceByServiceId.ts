import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SkintypeServiceDto } from "../dto/skintype-service.dto";

export const useSkintypeServiceByServiceId = (serviceId: string) => {
  return useQuery<SkintypeServiceDto, Error>({
    queryKey: ["getSkintypeServiceByServiceId", serviceId],
    queryFn: async () => {
      const response = await axios.get<SkintypeServiceDto>(
        `https://localhost:7071/getSkintypeServiceByServiceId/${serviceId}`
      );
      return response.data;
    },
    enabled: !!serviceId,
  });
};
