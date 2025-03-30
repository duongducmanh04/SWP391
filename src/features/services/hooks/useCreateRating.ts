import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { RatingDto } from "../dto/rating.dto";

export const useCreateRating = () => {
  return useMutation({
    mutationFn: async (newRating: RatingDto) => {
      // Đảm bảo feedback có giá trị hợp lệ
      const payload: RatingDto = {
        ...newRating,
        feedback: newRating.feedback ?? "", // Nếu undefined thì thành chuỗi rỗng
      };

      console.log("📤 Gửi request lên API:", payload); // Debug log

      const response = await axios.post(
        `https://skincareservicebooking.onrender.com/api/Rating`,
        payload,
        {
          headers: { "Content-Type": "application/json" }, // Đảm bảo gửi đúng JSON
        }
      );

      return response.data;
    },
  });
};
