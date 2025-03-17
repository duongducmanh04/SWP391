import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { QuizAnswerDto } from "../dto/quiz-answer.dto";

interface MutationVariables {
  id: string;
  data: QuizAnswerDto;
}

export const useUpdateQuizAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MutationVariables>({
    mutationFn: async ({ id, data }: MutationVariables): Promise<void> => {
      await axios.put(`https://localhost:7071/api/QuizAnswer/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["QuizAnswer"] });
    },
  });
};
