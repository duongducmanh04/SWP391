import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { RegisterDto } from "../dto/register.dto";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (newAccount: RegisterDto) => {
      const response = await axios.post(
        `https://localhost:7071/api/auth/register`,
        newAccount
      );
      return response.data;
    },
  });
};
