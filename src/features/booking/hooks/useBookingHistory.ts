import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BookingDto } from "../dto/booking.dto";

const API_BASE_URL = "https://localhost:7071/api/Booking";

const fetchBookingHistory = async (): Promise<BookingDto[]> => {
  const response = await axios.get<BookingDto[]>(
    `${API_BASE_URL}/previousBooking`
  );
  return response.data;
};

export const useBookingHistory = () => {
  return useQuery<BookingDto[], Error>({
    queryKey: ["getBookingHistory"],
    queryFn: fetchBookingHistory,
  });
};

interface MutationVariables {
  BookingId: number;
}

export const useCancelledBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MutationVariables>({
    mutationFn: async ({ BookingId }: MutationVariables): Promise<void> => {
      await axios.put(`${API_BASE_URL}/cancelled/${BookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBookingHistory"] });
    },
  });
};
