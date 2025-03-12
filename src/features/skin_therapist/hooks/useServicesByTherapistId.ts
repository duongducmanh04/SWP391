import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ServiceDto } from "../../services/dto/get-service.dto";
import { TherapistDto } from "../dto/get-therapist.dto";

const API_THERAPIST_URL =
  "https://localhost:7071/api/skintherapist/getSkintherapistById";
const API_SERVICE_URL = "https://localhost:7071/api/service/getServiceById";

// Mapping cứng các dịch vụ theo chuyên viên
const therapistServiceMapping: Record<number, number[]> = {
  1: [4], // Dr. Emily White cung cấp dịch vụ có ID là 1 (Facial)
  2: [2, 3], // Dr. Michael Brown cung cấp dịch vụ có ID là 2, 3
};

export const useServicesByTherapistId = (skintherapistId: string) => {
  return useQuery<ServiceDto[], Error>({
    queryKey: ["getServicesByTherapistId", skintherapistId],
    queryFn: async () => {
      const therapistResponse = await axios.get<TherapistDto>(
        `${API_THERAPIST_URL}/${skintherapistId}`
      );
      const therapist = therapistResponse.data;

      // Tìm serviceIds dựa trên skintherapistId
      const serviceIds =
        therapistServiceMapping[therapist.skintherapistId] || [];

      if (serviceIds.length === 0) return [];

      const servicePromises = serviceIds.map((serviceId) =>
        axios
          .get<ServiceDto>(`${API_SERVICE_URL}/${serviceId}`)
          .then((res) => res.data)
      );

      const services = await Promise.all(servicePromises);
      return services;
    },
    enabled: !!skintherapistId,
  });
};
