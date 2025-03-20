import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { QuizAnswerDto } from "../dto/quiz-answer.dto";

export const useCreateQuizAnswer = () => {
  return useMutation({
    mutationFn: async (newQuizAnswer: QuizAnswerDto) => {
      const response = await axios.post(
        `https://localhost:7071/api/QuizAnswer`,
        newQuizAnswer
      );
      return response.data;
    },
  });
};
