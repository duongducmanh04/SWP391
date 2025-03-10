import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface SubmitQuizDto {
  customerId: number;
  answers: { questionId: number; answerId: number }[];
}

export interface SubmitQuizResponse {
  surveyId: number; // Định danh của survey
  recommendedSkinType: string; // Kết quả loại da được đề xuất
}

const submitQuiz = async (data: SubmitQuizDto): Promise<SubmitQuizResponse> => {
  const response = await axios.post("https://localhost:7071/submit", data, {
    headers: { "Content-Type": "application/json" },
  });

  console.log("Dữ liệu phản hồi từ API:", response.data); // In ra để kiểm tra
  return response.data; // Trả về dữ liệu đúng cấu trúc
};

export const useSubmitQuiz = () => {
  return useMutation<SubmitQuizResponse, Error, SubmitQuizDto>({
    mutationFn: submitQuiz,
  });
};
