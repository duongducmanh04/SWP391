import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteQuizAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (id: number) => {
      const response = await axios.delete<{ message: string }>(
        `https://localhost:7071/api/QuizAnswer/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["QuizAnswer"] });
    },
  });
};
