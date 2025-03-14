import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ServiceDto } from "../dto/get-service.dto";

export const useCreateService = () => {
  return useMutation({
    mutationFn: async (newService: ServiceDto) => {
      const response = await axios.post(
        `https://localhost:7071/api/service/createService`,
        newService
      );
      return response.data;
    },
  });
};
