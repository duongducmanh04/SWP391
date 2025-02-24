import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookingDto } from "../dto/booking.dto";

const fetchBookings = async (): Promise<BookingDto[]> => {
  const response = await axios.get<BookingDto[]>(
    "http://skincare-sbs.southeastasia.azurecontainer.io:8080/api/Booking/getAllBookings"
  );
  return response.data;
};

export const useBookingss = () => {
  return useQuery<BookingDto[], Error>({
    queryKey: ["getAllBookings"],
    queryFn: fetchBookings,
  });
};
