import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface VerifyOTPDto {
  email: string;
  otp: string;
}

export const useVerifyOTP = () => {
  return useQuery({
    queryKey: ["verifyOtp"],
    queryFn: async () => {
      const response = await axios.post<VerifyOTPDto[]>(
        "https://localhost:7071/api/auth/verifyOtp"
      );
      return response.data;
    },
  });
};
