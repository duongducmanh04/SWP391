import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteQuizAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number): Promise<void> => {
      await axios.delete(`https://localhost:7071/api/QuizAnswer/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["QuizAnswer"] });
    },
  });
};
