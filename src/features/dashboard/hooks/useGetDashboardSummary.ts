import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DashboardDto } from "../dto/dashboard.dto";

const fetchDashboardSummary = async (): Promise<DashboardDto> => {
  const response = await axios.get<DashboardDto>(
    "https://localhost:7071/getDashboardSummary"
  );
  return response.data;
};

export const useDashboardSummary = () => {
  return useQuery<DashboardDto, Error>({
    queryKey: ["getDashboardSummary"],
    queryFn: fetchDashboardSummary,
  });
};
