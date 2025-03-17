import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { QuizQuestionDto } from "../dto/quiz-question.dto";

interface MutationVariables {
  id: string;
  data: QuizQuestionDto;
}

export const useUpdateQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MutationVariables>({
    mutationFn: async ({ id, data }: MutationVariables): Promise<void> => {
      await axios.put(`https://localhost:7071/api/QuizQuestion/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["QuizQuestion"] });
    },
  });
};
