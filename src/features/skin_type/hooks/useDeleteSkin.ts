import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteSkin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (skintypeId: number): Promise<void> => {
      await axios.delete(
        `https://localhost:7071/api/skintype/deleteSkintype/${skintypeId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deleteService"] });
    },
  });
};
