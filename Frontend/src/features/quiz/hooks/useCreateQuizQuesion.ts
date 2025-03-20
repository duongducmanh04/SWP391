import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { QuizQuestionDto } from "../dto/quiz-question.dto";

export const useCreateQuizQuestion = () => {
  return useMutation({
    mutationFn: async (newQuizQuestion: QuizQuestionDto) => {
      const response = await axios.post(
        `https://localhost:7071/api/QuizQuestion`,
        newQuizQuestion
      );
      return response.data;
    },
  });
};
