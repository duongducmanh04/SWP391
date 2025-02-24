import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookingDto } from "../dto/booking.dto";

export const useBookingById = (bookingId: string) => {
  return useQuery<BookingDto, Error>({
    queryKey: ["getServiceById", bookingId],
    queryFn: async () => {
      const response = await axios.get<BookingDto>(
        `https://localhost:7071/api/Booking/${bookingId}`
      );
      return response.data;
    },
    enabled: !!bookingId,
  });
};
