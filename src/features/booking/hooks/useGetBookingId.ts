import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookingDto } from "../dto/booking.dto";

export const useBookingById = (bookingId: string) => {
  return useQuery<BookingDto, Error>({
    queryKey: ["getServiceById", bookingId],
    queryFn: async () => {
      const response = await axios.get<BookingDto>(
        `http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/service/getServiceById/${bookingId}`
      );
      return response.data;
    },
    enabled: !!bookingId,
  });
};
