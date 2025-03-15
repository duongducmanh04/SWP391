import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ForgorPasswordDto {
  email: string;
}

export const useForgotPassword = () => {
  return useQuery({
    queryKey: ["forgotPassword"],
    queryFn: async () => {
      const response = await axios.post<ForgorPasswordDto[]>(
        "https://localhost:7071/api/auth/forgotPassword"
      );
      return response.data;
    },
  });
};
