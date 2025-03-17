import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: async (verifyOTP: VerifyOtpDto) => {
      const response = await axios.post(
        `https://localhost:7071/api/auth/verifyOtp`,
        verifyOTP
      );
      return response.data;
    },
  });
};
