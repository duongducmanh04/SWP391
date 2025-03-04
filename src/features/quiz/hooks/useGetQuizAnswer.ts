import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QuizAnswerDto } from "../dto/quiz-answer.dto";

const fetchQuizAnswer = async (): Promise<QuizAnswerDto[]> => {
  const response = await axios.get<QuizAnswerDto[]>(
    "https://localhost:7071/getAllQuizAnswers"
  );
  return response.data;
};

export const useQuizAnswer = () => {
  return useQuery<QuizAnswerDto[], Error>({
    queryKey: ["getAllQuizAnswers"],
    queryFn: fetchQuizAnswer,
  });
};
