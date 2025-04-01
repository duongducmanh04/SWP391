import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string): Promise<void> => {
      await axios.delete(
        `https://localhost:7071/api/service/deleteService/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deleteService"] });
    },
  });
};
