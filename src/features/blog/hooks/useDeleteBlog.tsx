import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string): Promise<void> => {
      await axios.delete(`https://localhost:7071/deleteBlog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deleteBlog"] });
    },
  });
};
