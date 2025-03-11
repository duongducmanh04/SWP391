import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SubmitQuizDto, SubmitQuizResponse } from "../dto/submit-survey.dto";

const submitQuiz = async (data: SubmitQuizDto): Promise<SubmitQuizResponse> => {
  const response = await axios.post("https://localhost:7071/submit", data, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

export const useSubmitQuiz = () => {
  return useMutation<SubmitQuizResponse, Error, SubmitQuizDto>({
    mutationFn: submitQuiz,
  });
};
