import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreateBookingDto } from "../dto/create-booking.dto";

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (createBooking: CreateBookingDto) => {
      const response = await axios.post(
        "https://localhost:7071/api/Booking/create-booking",
        createBooking
      );
      return response.data;
    },
  });
};
