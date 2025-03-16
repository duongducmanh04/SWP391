import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface ForgotPasswordDto {
  email: string;
}

const forgotPassword = async (email: string) => {
  console.log("🔹 Sending request with email:", email); 

  const response = await axios.post(
    "https://localhost:7071/api/auth/forgotPassword",
    { email }, 
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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};
