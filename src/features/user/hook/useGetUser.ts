// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserDto } from "../dto/get-user.dto";

const fetchUsers = async (): Promise<UserDto[]> => {
  const response = await axios.get<UserDto[]>(
    "https://6670d16d0900b5f8724babe3.mockapi.io/api/v1/studentManagement"
  );
  return response.data;
};

export const useUsers = () => {
  return useQuery<UserDto[], Error>({
    queryKey: ["studentManagement"],
    queryFn: fetchUsers,
  });
};
