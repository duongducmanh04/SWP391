import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

const resetPassword = async (data: ResetPasswordDto) => {
  console.log("🔹 Sending reset password request:", data); 

  const response = await axios.post(
    "https://localhost:7071/api/auth/resetPassword",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  );

  console.log("✅ API Response:", response.data); 
  return response.data;
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
