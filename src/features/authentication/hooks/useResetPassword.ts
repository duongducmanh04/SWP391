import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

export const useResetPassword = () => {
  return useQuery({
    queryKey: ["resetPassword"],
    queryFn: async () => {
      const response = await axios.post<ResetPasswordDto[]>(
        "https://localhost:7071/api/auth/resetPassword"
      );
      return response.data;
    },
  });
};
