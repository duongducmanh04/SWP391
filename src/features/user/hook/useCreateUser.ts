import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UserDto } from "../dto/get-user.dto";

const API_BASE_URL =
  "https://6670d16d0900b5f8724babe3.mockapi.io/api/v1/studentManagement";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (newUser: UserDto) => {
      const response = await axios.post(`${API_BASE_URL}`, newUser);
      return response.data;
    },
  });
};
