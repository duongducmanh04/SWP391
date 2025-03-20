import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ServiceDto } from "../dto/get-service.dto";

const fetchServices = async (): Promise<ServiceDto[]> => {
  const response = await axios.get<ServiceDto[]>(
    "https://localhost:7071/api/service/getAllServices"
  );
  return response.data;
};

export const useServices = () => {
  return useQuery<ServiceDto[], Error>({
    queryKey: ["getAllServices"],
    queryFn: fetchServices,
  });
};
