import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

const verifyOtp = async (data: VerifyOtpDto) => {
  const response = await axios.post(
    "https://localhost:7071/api/auth/verifyOtp",
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json",
      },
    }
  );
  return response.data;
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};
