import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (resetPassword: ResetPasswordDto) => {
      const response = await axios.post(
        `https://localhost:7071/api/auth/resetPassword`,
        resetPassword
      );
      return response.data;
    },
  });
};
