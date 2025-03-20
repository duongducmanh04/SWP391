import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface MutationVariables {
  bookingId: number;
  skintherapistId: number;
}

export const useUpdateTherapist = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MutationVariables>({
    mutationFn: async ({
      bookingId,
      skintherapistId,
    }: MutationVariables): Promise<void> => {
      await axios.put(
        `https://localhost:7071/api/Booking/skintherapist/${bookingId}?skintherapistId=${skintherapistId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skintherapist"] });
    },
  });
};
