import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface MutationVariables {
  bookingId: number;
  amount: number;
}

export const useUpdateServiceAmount = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MutationVariables>({
    mutationFn: async ({
      bookingId,
      amount,
    }: MutationVariables): Promise<void> => {
      await axios.put(
        `https://localhost:7071/api/Booking/amount/${bookingId}?amount=${amount}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amount"] });
    },
  });
};
