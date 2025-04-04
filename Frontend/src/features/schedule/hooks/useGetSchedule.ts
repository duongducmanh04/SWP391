import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ScheduleDto } from "../dto/schedule.dto";

const fetchScheduleByService = async (
  serviceId: number
): Promise<ScheduleDto[]> => {
  if (!serviceId) throw new Error("Service ID is required to fetch schedules!");

  const response = await axios.get<ScheduleDto[]>(
    `https://localhost:7071/search-by-service/${serviceId}`
  );
  return response.data;
};

export const useGetSchedule = (serviceId: number) => {
  return useQuery<ScheduleDto[], Error>({
    queryKey: ["getSchedule", serviceId],
    queryFn: () => fetchScheduleByService(serviceId),
    enabled: !!serviceId,
  });
};
